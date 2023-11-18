import { Client, Events, GatewayIntentBits, OAuth2Scopes } from 'discord.js';
import { Database } from './database';
import { loadCommands } from './loadCommands';
import { messageReactionAdd } from './reaction/MessageReactionAdd';
import { messageReactionRemove } from './reaction/MessageReactionRemove';
import { isTracking } from './utilities';
import { makerJoin } from './voiceState/maker';
import { joinSub, leaveSub } from './voiceState/sub';

const TOKEN = process.env.TOKEN;

const commands = await loadCommands();
const database = Database()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,

        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
    ],
});

client.login(TOKEN);

client.once(Events.ClientReady, c => {
    const inv = client.generateInvite({
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: ["Administrator"],
    })

    console.log(`Ready! Logged in as ${c.user.tag}`);
    console.log(`Invite: ${inv}`);
});

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        command.execute(interaction, database);
    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    // find the action: joins/leaves/moves
    const action = oldState.channelId ? newState.channelId ? "moves" : "leaves" : "joins";

    const newChannelTracking = isTracking(newState.channelId || "-1", database);
    const oldChannelTracking = isTracking(oldState.channelId || "-1", database);
    // console.log();
    // console.log("new", newChannelTracking);
    // console.log("old", oldChannelTracking);

    if (!newChannelTracking && !oldChannelTracking) return;

    const user = newState.member?.user
    if (!user) return;
    const username = user.username;

    // console.log("voice state update");
    // console.log("action:", action);
    // console.log("user:", username);


    if (action === "joins") {
        if (newChannelTracking && newChannelTracking.type == "maker") return makerJoin(newState, database)
    }
    else if (action === "leaves") {
        if (oldChannelTracking && oldChannelTracking.type == "sub") return leaveSub(oldState, database)
    }
    else if (action === "moves") {
        if (newChannelTracking && newChannelTracking.type == "sub") return joinSub(newState, database)

    }
    else {
        console.log("unknown action");
    }


    return console.log("no function called");
});


client.on(Events.MessageReactionAdd, async (reaction, user) => messageReactionAdd(reaction, user, database))

client.on(Events.MessageReactionRemove, async (reaction, user) => messageReactionRemove(reaction, user, database))

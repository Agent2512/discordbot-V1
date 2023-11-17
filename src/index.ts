import { ChannelType, Client, Events, GatewayIntentBits, OAuth2Scopes, VoiceState } from 'discord.js';
import { base } from './database';
import { loadCommands } from './loadCommands';
import { makeChannel } from './utilities';

const TOKEN = process.env.TOKEN;

const commands = await loadCommands();
const database = base()

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

    const newChannelTracking = database.makerChannel.get(newState.channelId || "-1");
    const oldChannelTracking = database.makerChannel.get(oldState.channelId || "-1");
    if (!newChannelTracking && !oldChannelTracking) return;

    console.log("voice state update");
    console.log(action);

    const user = newState.member?.user.username

    console.log(user);


    if (action === "joins") {

    }
    else if (action === "moves") {


    }
    else if (action === "leaves") {

    }
    else {
        console.log("unknown action");
    }
});

const joinFunc = async (newState: VoiceState) => {
    const channel = newState.channel
    if (!channel) return;
    const caChannel = channel.parent;
    if (!caChannel) return;

    const user = newState.member?.user.username
    if (!user) return;

    const newChannel = await makeChannel(newState.guild, `${user}'s channel`, ChannelType.GuildVoice, caChannel.id);
    if (!newChannel) return;

    newState.setChannel(newChannel.id);
}

const leaveFunc = async (oldState: VoiceState) => {

}



import { ChannelType, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { Database } from "../database";
import { isTracking } from "../utilities";

export const messageReactionAdd = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, database: Database) => {
    // get channel 
    const channel = reaction.message.channel;

    // get user id
    const uid = user.id;

    // is tracking channel
    const tracking = isTracking(channel.id, database);
    if (!tracking) return;

    // is sub channel
    if (tracking.type !== "sub") return;

    // is user owner of sub channel
    if (tracking.user !== uid) return;

    // is GuildVoice channel
    if (channel.type !== ChannelType.GuildVoice) return;

    // is lock emoji
    if (reaction.emoji.name === "🔒") {
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            Connect: false,
        })
    }
}
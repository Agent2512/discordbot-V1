import { Guild, GuildChannelTypes } from "discord.js";
import { Database } from "../database";

export const makeChannel = async (guild: Guild, channelName: string, type: GuildChannelTypes, parentCategory?: string) => {
    const channel = await guild.channels.create({
        name: channelName,
        type: type,
        parent: parentCategory,
    })

    if (!channel) return null;

    return channel;
}

export const isTracking = (channelId: string, database: Database) => {
    const channel = database.trackingChannel.get("channel", channelId)

    return channel ? channel : false;
}
import { Guild, GuildChannelTypes } from "discord.js";

export const makeChannel = async (guild: Guild, channelName: string, type: GuildChannelTypes, parentCategory?: string) => {
    const channel = await guild.channels.create({
        name: channelName,
        type: type,
        parent: parentCategory,
    })

    if (!channel) return null;

    return channel;
}
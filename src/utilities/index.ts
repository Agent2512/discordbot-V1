import { Client, Guild, GuildChannelTypes } from "discord.js";
import { Database, trackingChannelSchema } from "../database";

export const makeChannel = async (guild: Guild, channelName: string, type: GuildChannelTypes, parentCategory?: string) => {
    const channel = await guild.channels.create({
        name: channelName,
        type: type,
        parent: parentCategory,
    })

    if (!channel) return null;

    return channel;
}

export const isTracking = (channelId: string, db: Database) => {
    const channel = db.trackingChannel.get("channel", channelId)

    return channel ? channel : false;
}

// a function that runs on startup get all sub channels from database
// and check if they are still exist if not delete them from database
// and if they are still exist check if they user is still in them if not delete them from database 
export const checkSubChannels = async (client: Client<true>, db: Database) => {
    const channels = db.trackingChannel.filter("Select", {
        condition: "type == 'sub'"
    }) as typeof trackingChannelSchema.schema[]

    for (const ch of channels) {
        if (!ch.channel || !ch.use) continue;

        const channel = await client.channels.fetch(ch.channel);
        if (!channel) return

        if (!channel.isVoiceBased()) return;

        const memberIds = channel.members.map(m => m.user.id);

        if (memberIds.length === 0) {
            db.trackingChannel.delete("channel", ch.channel);
            channel.delete();
            return;
        }
        else if (!memberIds.includes(ch.use)) {
            db.trackingChannel.delete("channel", ch.channel);
            channel.delete();
            return;
        }
    }
}

export const guildCreate = async (guild: Guild, db: Database) => {
    const guildId = guild.id;

}

export const guildDelete = async (guild: Guild, db: Database) => {
    const guildId = guild.id;

    db.trackingChannel.delete("guild", guildId);
}
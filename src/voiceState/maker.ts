import { ChannelType, VoiceState } from "discord.js";
import { Database } from "../database";
import { makeChannel } from "../utilities";

export const makerJoin = async (state: VoiceState, db: Database) => {
    // get channel user is in
    const channel = state.channel;
    if (!channel) return;
    // get parent category of channel
    const caChannel = channel.parent;
    if (!caChannel) return;

    // get username
    const user = state.member?.user
    if (!user) return;
    const username = user.username;

    // make new channel sub channel of parent category
    const subChannel = await makeChannel(state.guild, `${username}'s channel`, ChannelType.GuildVoice, caChannel.id);
    if (!subChannel) return;

    // add new subChannel to database
    db.trackingChannel.set({ channel: subChannel.id, type: "sub", use: user.id, guild: state.guild.id })

    // move user to new sub channel
    state.setChannel(subChannel.id);
}

// the user will never leave the maker channel because they will be moved ones they join the maker channel
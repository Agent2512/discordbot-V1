import { VoiceState } from "discord.js";
import { Database } from "../database";

export const joinSub = async (state: VoiceState, db: Database) => {
    console.log("join sub");
    // get user that joined
    const user = state.member?.user
    if (!user) return;

    // get sub channel
    const subChannel = state.channel;
    if (!subChannel) return;

    const message = await subChannel.send(`${user} Here you can control your voice channel. \n or use \n /look or /unlock \n /limit or /nolimit`);

    // look emoji
    await message.react("🔒")
}


/*
    the state is the old state for reference
*/
export const leaveSub = async (state: VoiceState, db: Database) => {
    // get channel user is in
    const channel = state.channel;
    if (!channel) return;

    // get user
    const user = state.member?.user
    if (!user) return;

    // was user owner of a sub channel?. check database
    const subChannel = db.trackingChannel.get("user", user.id)
    if (!subChannel) return;

    // remove sub channel from database
    db.trackingChannel.delete("user", user.id)

    // delete sub channel
    await state.guild.channels.delete(channel)
}
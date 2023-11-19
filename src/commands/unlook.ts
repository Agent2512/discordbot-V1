import { ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Database } from "../database";

export const data = new SlashCommandBuilder()
    .setName('unlook')
    .setDescription('unlooks the sub channel you are in')

export const execute = async (interaction: CommandInteraction, db: Database) => {
    // get user
    const user = interaction.user
    if (!user) return;

    // get sub channel form database
    const subChannel = db.trackingChannel.get("use", user.id)
    if (!subChannel) return interaction.reply("you are not in a sub channel");

    // get channel
    const channel = interaction.client.channels.cache.get(subChannel.channel || "-1")
    if (!channel) return;

    // is GuildVoice channel
    if (channel.type !== ChannelType.GuildVoice) return;

    // look channel
    channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        Connect: true,
    })

    return interaction.reply("unlooked")
}
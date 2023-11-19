import { ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Database } from "../database";

export const data = new SlashCommandBuilder()
    .setName('limit')
    .setDescription('set a limit on the sub channel you are in')
    .addIntegerOption(option => option.setName("limit").setDescription("the limit you want to set").setRequired(true))

export const execute = async (interaction: CommandInteraction, db: Database) => {
    // get limit
    const limit = interaction.options.get("limit", true)
    if (!limit) return;


    if (typeof limit.value !== "number") return interaction.reply("limit must be a number");

    const value = Math.min(Math.max(limit.value, 0), 99)

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

    // set limit
    await channel.setUserLimit(value)

    // reply
    return await interaction.reply(`channel new set limit to ${value}`)
}
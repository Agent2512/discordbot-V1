import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Database } from "../database";

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')

export const execute = async (interaction: CommandInteraction, db: Database) => {
    await interaction.reply('Pong!');
}
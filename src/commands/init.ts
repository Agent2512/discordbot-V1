import { ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Database } from "../database";
import { makeChannel } from "../utilities";

export const data = new SlashCommandBuilder()
    .setName('init')
    .setDescription('initializes the bot')
    .setDefaultMemberPermissions(8)
    .addChannelOption(option =>
        option
            .setName("category")
            .setDescription("The category to track")
            .setRequired(true)
    )

export const execute = async (interaction: CommandInteraction, db: Database) => {
    const category = interaction.options.get("category");
    if (!category) return;

    const caChannel = category.channel
    const guild = interaction.guild;
    if (!caChannel || !guild) return;

    if (caChannel.type !== ChannelType.GuildCategory) {
        return await interaction.reply(`must be a category`);
    }

    const dbtest = db.trackingChannel.filter("Select", {
        condition: `type = "maker" AND use = "${caChannel.id}"`
    })

    if (dbtest.length > 0) {
        return await interaction.reply(`already tracking`);
    }

    const channel = await makeChannel(guild, "make a channel", ChannelType.GuildVoice, caChannel.id);
    if (!channel) return;

    const cid = channel.id;
    db.trackingChannel.set({ channel: cid, type: "maker", use: caChannel.id, guild: guild.id })

    await interaction.reply(`tracking use ${channel}`);
}
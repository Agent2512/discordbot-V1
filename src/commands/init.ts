import { ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { base } from "../database";
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

export const execute = async (interaction: CommandInteraction, db: base) => {
    const category = interaction.options.get("category");
    if (!category) return;

    const caChannel = category.channel
    const guild = interaction.guild;
    if (!caChannel || !guild) return;

    const caId = caChannel.id;

    const test = await guild.channels.fetch(caId);
    if (!test) return;

    if (test.type !== ChannelType.GuildCategory) {
        return await interaction.reply(`must be a category`);
    }

    const isCat = db.initCategory.get(caId);

    if (isCat) {
        return await interaction.reply(`already tracking`);
    }
    else {
        db.initCategory.set(caId);

        const channel = await makeChannel(guild, "make a channel", ChannelType.GuildVoice, caId);
        if (!channel) return;

        const cid = channel.id;
        db.makerChannel.set(cid);
    }

    await interaction.reply(`tracking`);
}
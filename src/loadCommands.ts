import { Collection, CommandInteraction, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { Database } from "./database";



type module = {
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction, db: Database) => Promise<void>
}

export const loadCommands = async () => {
    const commands = new Collection<string, module>();

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    return commands;
}

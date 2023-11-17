import { REST, Routes } from "discord.js";
import { loadCommands } from "./loadCommands";

const TOKEN = process.env.TOKEN as string;
const APP_ID = process.env.APP_ID as string;

const commands = await loadCommands();

const commandsInShort = commands.map(c => c.data.toJSON());

const rest = new REST().setToken(TOKEN);

await rest.put(Routes.applicationCommands(APP_ID), { body: commandsInShort })

commandsInShort.forEach(c => {
    console.log(`command: {${c.name}} description: ${c.description}`);
})
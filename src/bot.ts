import { ActivityType, Client } from 'discord.js';
import { readdirSync } from "node:fs";
import Command from './api/Command';
import Listener from './api/Listener';
import { TOKEN } from "./config.json";

export const bot: Client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'] // Make sure to enable MessageContent intents in the developer portal!
});

export const commands: Map<string, Command> = new Map<string, Command>;
const commandAliases: Map<string, Command> = new Map<string, Command>;
const listeners: Listener[] = [];

bot.once('ready', async () => {
  const user = bot.user;
  if (!user) return;
  console.log(`Logged in as ${user.tag}!`);

  let members;
  bot.guilds.cache.forEach(guild => members = + guild.memberCount);
  const servers = bot.guilds.cache.filter(guild => guild != null).size;
  user.setActivity({ type: ActivityType.Watching, name: `${members} members in ${servers} servers` });

  await registerCommands();
  await registerListeners();
});

async function register(path: string, method: Function) {
  const dirname = `${__dirname}/${path}`
  const cmdFiles = readdirSync(dirname);
  for (const file of cmdFiles) {
    const fileClass = (await import(`${dirname}/${file}`)).default;
    const instance = new fileClass();
    method(instance);
  }
}

const registerCommands = async () => await register('commands', addCommand);
const registerListeners = async () => await register('listeners', addListener);

function addCommand(command: Command) {
  const names: string[] = [...command.aliases, ...command.name];
  for (const name of names) {
    commandAliases.set(name, command);
  }
  commands.set(command.name, command);
}

function addListener(listener: Listener) {
  listeners.push(listener);
  const type = listener.type;

  if (listener.once) {
    bot.once(type, async (...args: any[]) => await passArgs(listener, args));
    return;
  }
  bot.on(type, async (...args: any[]) => await passArgs(listener, args));
}

async function passArgs(listener: Listener, ...args: any[]): Promise<void> {
  return await listener.run(bot, args[0][0]);
}

export function getCommand(name: string): Command | undefined {
  return commands.get(name) ?? commandAliases.get(name);
}

bot.login(TOKEN);
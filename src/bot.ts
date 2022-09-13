import { ActivityType, Client } from 'discord.js';
import Command from './api/Command';
import Listener from './api/Listener';
import CommandListCommand from './commands/CommandList';
import { TOKEN } from "./config.json";
import CommandRegister from './listeners/CommandRegister';

export const bot: Client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'] // Make sure to enable MessageContent intents in the developer portal!
});

const commands: Map<string, Command> = new Map<string, Command>;
const commandAliases: Map<string, Command> = new Map<string, Command>;
const listeners: Listener[] = [];

bot.once('ready', () => {
  const user = bot.user;
  if (!user) return;
  console.log(`Logged in as ${user.tag}!`);

  let members;
  bot.guilds.cache.forEach(guild => members = + guild.memberCount);
  const servers = bot.guilds.cache.filter(guild => guild != null).size;
  user.setActivity({ type: ActivityType.Watching, name: `${members} members in ${servers} servers` });

  registerCommands();
  registerListeners();
});

const registerCommands = () => {
  addCommand(new CommandListCommand(commands));
}

const registerListeners = () => {
  addListener(new CommandRegister());
}

function addCommand(command: Command) {
  const names: string[] = [];
  for (const alias of command.aliases) {
    names.push(alias);
  }
  names.push(command.name);
  for (const name of names) {
    commandAliases.set(name, command);
  }
  commands.set(command.name, command);
}

function addListener(listener: Listener) {
  listeners.push(listener);
  if (listener.once) {
    bot.once(listener.type, async (...args: any[]) => await passArgs(listener, args));
    return;
  }
  bot.on(listener.type, async (...args: any[]) => await passArgs(listener, args));
}

async function passArgs(listener: Listener, ...args: any[]): Promise<void> {
  return await listener.run(bot, args[0][0]);
}

export function getCommand(name: string): Command | undefined {
  return commands.get(name) ?? commandAliases.get(name);
}

bot.login(TOKEN);
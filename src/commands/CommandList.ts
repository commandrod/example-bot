import { Client, Message } from "discord.js";
import Command from "../api/Command";
import { PermissionType } from "../api/PermissionType";
import { getCommand } from "../bot";
import { PREFIX } from "../config.json";
import { embed, error, sendEmbed } from "../utils/embed";

const title = '🤖 | Commands';

export default class CommandListCommand implements Command {
  name: string = 'cmds';
  aliases: string[] = ['commandlist', 'cmd', 'commands'];
  description: string = 'Shows all existing commands';
  permission: PermissionType = "NONE";
  usage: string = '[command]';

  private readonly commands: Map<string, Command>;

  public constructor(commands: Map<string, Command>) {
    this.commands = commands;
  }

  async run(message: Message<boolean>, args: string[], client: Client<boolean>): Promise<void> {
    if (args.length == 0) {
      let commandString = `For more detail about a command use:\n**${PREFIX}${this.name} <command>**\n `;
      for (const command of this.commands.values()) {
        commandString += `\n**${PREFIX}${command.name}** | ${command.description}`;
      }
      commandString += '\n \n*if you\'re having trouble using a command, contact a staff member.*';
      await sendEmbed(message.channel, embed({ title, description: commandString }));
      return;
    }
    const commandName = args.join('');
    const command = getCommand(commandName);
    if (!command) {
      await sendEmbed(message.channel, error('The specified command wasn\'t found!'));
      return;
    }
    const aliases = command.aliases;
    const aliasesStr = aliases.length == 0 ? '**None**' : `**${aliases.join(', ')}**`;
    await sendEmbed(message.channel, embed({ title, description: `**${PREFIX}${command.name}** ${command.usage}\nAliases: ${aliasesStr}\n${command.description}` }));
  }
}
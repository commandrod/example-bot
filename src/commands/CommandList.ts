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
  description: string = 'מראה את כל הפקודות הקיימות';
  permission: PermissionType = "NONE";
  usage: string = '[פקודה]';
  commands: Map<string, Command>;

  public constructor(commands: Map<string, Command>) {
    this.commands = commands;
  }

  async run(message: Message<boolean>, args: string[], client: Client<boolean>): Promise<void> {
    if (args.length == 0) {
      let commandString = `על מנת לראות שימוש של פקודה מסויימת כתבו:\n**${PREFIX}${this.name} <השם של הפקודה>**\n `;
      for (const command of this.commands.values()) {
        commandString += `\n**${PREFIX}${command.name}** | ${command.description}`;
      }
      commandString += '\n \n*במידה ואתם מסתבכים עם הפקודות פנו אל צוות לעזרה.*';
      await sendEmbed(message.channel, embed({ title, description: commandString }));
      return;
    }
    const commandName = args.join('');
    const command = getCommand(commandName);
    if (!command) {
      await sendEmbed(message.channel, error('הפקודה המצויינת לא נמצאה!'));
      return;
    }
    const aliases = command.aliases;
    const aliasesStr = aliases.length == 0 ? '**אין**' : `**${aliases.join(', ')}**`;
    await sendEmbed(message.channel, embed({ title, description: `**${PREFIX}${command.name}** ${command.usage}\nשמות נוספים: ${aliasesStr}\n${command.description}` }));
  }
}
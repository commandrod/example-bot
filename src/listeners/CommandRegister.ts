import { Client, ClientEvents, Message, PermissionResolvable } from "discord.js";
import Command from "../api/Command";
import Listener from "../api/Listener";
import { PermissionType } from "../api/PermissionType";
import { getCommand } from "../bot";
import { PREFIX } from "../config.json";
import { error, sendEmbed } from "../utils/embed";

export default class CommandRegister implements Listener {
  type: keyof ClientEvents = 'messageCreate';
  once: boolean = false;

  async run(client: Client<boolean>, ...args: any[]): Promise<void> {
    const msg: Message = args[0];
    if (!msg) return;

    const { channel, content, member } = msg;
    if (!content.startsWith(PREFIX)) return;

    const split: string[] = content.slice(PREFIX.length).split(' ');
    const commandName: string = split[0];
    const command: Command | undefined = getCommand(commandName);
    if (!command) return;

    const commandArgs: string[] = split.slice(1);
    const { permission } = command;
    if (!member) return;

    if (!member.permissions.has(getPermission(permission))) {
      await sendEmbed(channel, error('Insufficient permissions!', member.user));
      return;
    }

    await msg.delete();
    await command.run(msg, commandArgs, client);
  }
}

function getPermission(permission: PermissionType): PermissionResolvable {
  switch (permission) {
    case "HIGH": return "Administrator";
    case "STAFF": return "ManageMessages";
  }
  return "SendMessages";
}
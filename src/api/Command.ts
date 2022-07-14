import { Client, Message } from "discord.js";
import { PermissionType } from "./PermissionType";

export default interface Command {
  name: string;
  aliases: string[];
  description: string;
  permission: PermissionType;
  usage: string;
  run(message: Message, args: string[], client: Client): Promise<void>;
}
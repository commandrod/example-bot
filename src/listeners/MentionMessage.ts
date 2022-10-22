import { ClientEvents, Client, Message } from "discord.js";
import Listener from "../api/Listener";
import { embed, sendEmbed } from "../utils/embed";
import { PREFIX } from "../config.json";

export default class MentionMessageListener implements Listener {
  type: keyof ClientEvents = 'messageCreate';
  once: boolean = false;

  async run(client: Client<boolean>, ...args: any[]): Promise<void> {
    const msg: Message = args[0];
    const { user } = client;
    if (!user) return;
    if (!msg.mentions.has(user)) return;

    await sendEmbed(msg.channel, embed({ title: '👋 | Hello!', description: `🤖 My prefix is \`${PREFIX}\` | Use \`${PREFIX}cmds\` to see all my commands!` }));
  }
}
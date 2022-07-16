import { EmbedFooterData } from "@discordjs/builders";
import { ColorResolvable, DMChannel, EmbedFieldData, Guild, Message, MessageEmbed, NewsChannel, PartialDMChannel, TextChannel, ThreadChannel, User, VoiceChannel } from "discord.js";
import { LOG_CHANNEL } from "../config.json";
import { getChannel } from "./utils";

export type EmbedOptions = {
  title?: string,
  color?: ColorResolvable,
  description?: string,
  author?: User,
  fields?: EmbedFieldData[],
  footer?: EmbedFooterData,
  image?: string,
  time?: boolean
}

export type SendabaleChannel = DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel;

export async function sendEmbed(channel: SendabaleChannel, embed: MessageEmbed): Promise<Message> {
  return await channel.send({ embeds: [embed] });
}

export function embed(options: EmbedOptions): MessageEmbed {
  const { title, color, description, author, fields, footer, image, time } = options;
  const embed: MessageEmbed = new MessageEmbed()
    .setTitle(title ? `**${title}**` : '✅ | Embed')
    .setColor(color ?? 0x24f2c6)
    .setDescription(description ?? '')
    .setFooter(footer ?? { text: '' })
    .setThumbnail(image ?? '');
  if (author) embed.setFooter({ text: `Sent by ${author.tag}`, iconURL: author.displayAvatarURL() ?? '' });
  if (fields) embed.addFields(fields);
  if (time) embed.setTimestamp(Date.now());
  return embed;
}

export function error(description: string, author?: User): MessageEmbed {
  return embed({ title: '❗ | Error', color: 0xdb0012, description, author });
}

export async function log(guild: Guild, description: string, author?: User): Promise<void> {
  const channel = getChannel(guild, LOG_CHANNEL);
  if (!channel) {
    console.log('Log channel is null!');
    return;
  }
  await sendEmbed(channel, embed({ title: '📜 | Log', description, color: 0xf5d93d, author }));
}
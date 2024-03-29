import { EmbedFooterData } from "@discordjs/builders";
import { ColorResolvable, DMChannel, EmbedBuilder, EmbedField, Guild, Message, NewsChannel, PartialDMChannel, TextChannel, ThreadChannel, User, VoiceChannel } from "discord.js";
import { LOG_CHANNEL } from "../config.json";
import { getTextChannel } from "./utils";

export type EmbedOptions = {
  title?: string,
  color?: ColorResolvable,
  description?: string,
  author?: User,
  fields?: EmbedField[],
  footer?: EmbedFooterData,
  image?: string,
  time?: boolean
}

export type SendabaleChannel = DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel;

export async function sendEmbed(channel: SendabaleChannel, embed: EmbedBuilder): Promise<Message> {
  return await channel.send({ embeds: [embed] });
}

export function embed(options: EmbedOptions): EmbedBuilder {
  const { title, color, description, author, fields, footer, image, time } = options;
  const embed: EmbedBuilder = new EmbedBuilder()
    .setTitle(title ? `**${title}**` : '✅ | Embed')
    .setColor(color ?? 0x24f2c6)
    .setDescription(description ?? '')
  if (image) embed.setThumbnail(image)
  const avatarURL = author?.avatarURL();
  if (author && avatarURL) embed.setFooter({ text: `Requested by ${author.tag}`, iconURL: avatarURL });
  if (footer) embed.setFooter(footer);
  if (fields) embed.addFields(fields);
  if (time) embed.setTimestamp(Date.now());
  return embed;
}

export function error(description: string, author?: User): EmbedBuilder {
  return embed({ title: '❗ | Error', color: 0xdb0012, description, author });
}

export async function log(guild: Guild, description: string, author?: User): Promise<void> {
  const channel = getTextChannel(guild, LOG_CHANNEL);
  if (!channel) {
    console.log('Log channel is null!');
    return;
  }
  await sendEmbed(channel, embed({ title: '📜 | Log', description, color: 0xf5d93d, author }));
}
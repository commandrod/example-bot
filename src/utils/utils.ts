import { Guild, GuildEmoji, GuildMember, Message, Role, TextChannel, VoiceChannel } from "discord.js";
import { bot } from "../bot";
import { error, SendabaleChannel, sendEmbed } from "./embed";

function filter(id: string) {
  const symbols: string = '<@&#!> ';
  for (const symbol of symbols) {
    id = id.replace(symbol, '');
  }
  return id;
}

export function getGuild(id: string): Guild | undefined {
  return bot.guilds.cache.get(filter(id));
}

export function getEmoji(guild: Guild, name: string): GuildEmoji | undefined {
  return guild.emojis.cache.find(emoji => emoji.name === name);
}

export function getMember(guild: Guild, id: string): GuildMember | undefined {
  return guild.members.cache.get(filter(id));
}

export function getRole(guild: Guild, id: string): Role | undefined {
  return guild.roles.cache.get(filter(id));
}

export function getTextChannel(guild: Guild, id: string): TextChannel | undefined {
  const channel = guild.channels.cache.get(filter(id));
  if (!channel) return undefined;
  if (!(channel instanceof TextChannel)) return undefined;
  return channel;
}

export function getVoiceChannel(guild: Guild, id: string): VoiceChannel | undefined {
  const channel = guild.channels.cache.get(filter(id));
  if (!channel) return undefined;
  if (!(channel instanceof VoiceChannel)) return undefined;
  return channel;
}

export function isBetween(given: number | undefined, min: number, max: number, channel?: SendabaleChannel): boolean {
  const errorMsg = error(`You must specify a number between ${min} - ${max}!`);
  if (!given) {
    if (channel) sendEmbed(channel, errorMsg);
    return false;
  }
  const bool = given >= min && given <= max && given > 0;
  if (!bool && channel) {
    sendEmbed(channel, errorMsg);
  }
  return bool;
}

export async function deleteWithin(msg: Message, seconds?: number): Promise<void> {
  try {
    if (!seconds) {
      await msg.delete();
      return;
    }
    setTimeout(async () => {
      await msg.delete();
    }, seconds * 1000);
  } catch (err) {
    console.log('Error when trying to delete message');
    console.error(err);
  }
}
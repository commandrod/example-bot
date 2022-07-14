import { Guild, GuildMember, Message, Role, TextChannel } from "discord.js";
import { error, SendabaleChannel, sendEmbed } from "./embed";

function filter(id: string) {
  const symbols: string = '<@&#!> ';
  for (const symbol of symbols) {
    id = id.replace(symbol, '');
  }
  return id;
}

export function getMember(guild: Guild, id: string): GuildMember | undefined {
  return guild.members.cache.get(filter(id));
}

export function getRole(guild: Guild, id: string): Role | undefined {
  return guild.roles.cache.get(filter(id));
}

export function getChannel(guild: Guild, id: string): TextChannel | null {
  const channel = guild.channels.cache.get(filter(id));
  if (!channel) return null;
  if (!(channel instanceof TextChannel)) return null;
  return channel;
}

export function isBetween(given: number | undefined, min: number, max: number, channel?: SendabaleChannel): boolean {
  const errorMsg = error(`You must specify a number between ${min}-${max}!`);
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
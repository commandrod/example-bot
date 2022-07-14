import { Client, ClientEvents } from "discord.js";

export default interface Listener {
  type: keyof ClientEvents;
  once: boolean;
  on(client: Client, ...args: any[]): Promise<void>;
}
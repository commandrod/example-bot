import { Client, ClientEvents } from "discord.js";

export default interface Listener {
  type: keyof ClientEvents;
  once: boolean;
  run(client: Client, ...args: any[]): Promise<void>;
}
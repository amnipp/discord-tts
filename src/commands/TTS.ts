import { Client } from "discord.js";
import { Commands } from "./Commands";

export class TTS extends Commands {
    constructor(client: Client) {
        super("TTS", client);
    }
}
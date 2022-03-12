import { Client } from "discord.js";
import { Commands } from "./Commands";

export class EnableTTS extends Commands {
    constructor(client: Client) {
        super("EnableTTS", client);
    }
    override execute(): void {
        Settings.TTSEnabled = !Settings.TTSEnabled;
    }
}
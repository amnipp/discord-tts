import { Client } from "discord.js";
import { Commands } from "./Commands";

export class PlaySounds extends Commands {
    constructor(client:Client) {
        super("PlaySounds",client);
    }
}
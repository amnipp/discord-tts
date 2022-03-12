import { Client } from "discord.js";
import { Commands } from "./Commands";

export class Help extends Commands {
    constructor(client: Client) {
        super("Help", client);
    }
}
import { Client } from "discord.js";

export class Commands {
    commandName:string;
    client: Client;
    constructor(commandName:string, client:Client) {
        this.commandName = commandName;
        this.client = client;
    }
    execute(): void { }
}

export enum CommandList {
    AddUser,
    EnableTTS,
    Help,
    PlaySounds,
    TTS
}
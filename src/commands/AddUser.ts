import { Commands } from "./Commands";

export class AddUser extends Commands {
    constructor(client) {
        super("AddUser", client);
    }
    userName: string;
    userID: string;
    customPrefix: string;
    ttsBotPreference: boolean;
    addUser(userName, userID, customPrefix, ttsBotPreference) {
        this.userName = userName;
        this.userID = userID;
        this.customPrefix = customPrefix;
        this.ttsBotPreference = ttsBotPreference;
        this.execute();
    }
    override execute(): void {
        
    }
}
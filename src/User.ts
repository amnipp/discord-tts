class User {
    userName: string;
    userID: string;
    customPrefix: string;
    ttsBotPreference: string;
    constructor(userName, userID, customPrefix, ttsBotPreference)
    {
        this.userName = userName;
        this.userID = userID;
        this.customPrefix = customPrefix;
        this.ttsBotPreference = ttsBotPreference;
    }
}
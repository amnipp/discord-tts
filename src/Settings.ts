class Settings {
    static CommandPrefix: string;
    static TTSUserList: User[];
    static TTSEnabled: boolean;
    constructor(commandPrefix:string, ttsUserList:User[], ttsEnabled: boolean) {
        Settings.CommandPrefix = commandPrefix;
        Settings.TTSUserList = ttsUserList;
        Settings.TTSEnabled = ttsEnabled;
    }
}
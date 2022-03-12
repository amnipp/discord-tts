class Commands {
    commandName:string;
    constructor(commandName:string) {
        this.commandName = commandName;
    }
    execute(fn: Function) { fn(); }
}
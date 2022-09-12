import { Command } from "../../types/command";
class TestCommand extends Command {
    async init() {
        this.data
            .setName('test')
            .setDescription('Test command')
    }

    // no need to define run as I just need default behavior for this command
}

const instance = new TestCommand()
export { instance }
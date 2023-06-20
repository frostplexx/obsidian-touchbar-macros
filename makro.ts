import {App} from "obsidian";
import {indexOf} from "builtin-modules";
const electron = require('electron').remote
/*
* This function executes the makro written in the makro language
* | Syntax    | Description                                                                                    |
* |-----------|------------------------------------------------------------------------------------------------|
* | [KEYCODE] | This is how you press a key, where `KEYCODE` is the name of the key you want pressed           |
* | +         | + is used to add a modifier eg: [Cmd]+[P] for pressing Command-P                                                           |
* | ,DELAY,   | , is used to add a delay between key presses where `DELAY` is the amount in ms                 |
* | "TEXT"    | " is used to add text where `TEXT` is the text you want to add. The plugin will type this text |
* | #COMMENT#         | # is used to add a comment where `COMMENT` is the comment you want to add  (NOT IMPLEMENTED)   |
* | \         | \ is used to escape the next character                                                        |
* | ( ){REPEAT} | () is used to repeat the previous command where `REPEAT` is the amount of times to repeat      |
*/

export function executeMakro(app: App, makro: string) {
	//parse the input, which is just one long string of the commands above
	const commands = parseMakro(makro)
	//execute the commands
	executeCommands(app, commands)
}

function executeCommands(app: App, commands: MakroCommand[]) {
	console.log(commands)
	commands.forEach((command) => {
		//check if the current command is a keycode command and the next is a presskeys command
		if (command.command === MakroCommandType.PressKey && commands[commands.indexOf(command) + 1]?.command === MakroCommandType.PressKeys && commands[commands.indexOf(command) + 2]?.command === MakroCommandType.PressKey) {
			//press those two keys together
			pressKeys(app, command.argument, commands[commands.indexOf(command) + 2]?.argument)
		} else {
			//execute the command
			switch (command.command) {
				case MakroCommandType.PressKey:
					pressKey(app, command.argument)
					break
				case MakroCommandType.AddText:
					addText(app, command.argument)
					break
				case MakroCommandType.Delay:
					waitFor(command.argument)

			}
		}
	})
}

function waitFor(argument: string) {
	//sleep for the amount of time in the argument
	const ms = parseInt(argument)
	const start = new Date().getTime();
	let end = start;
	while (end < start + ms) {
		end = new Date().getTime();
	}
}


function addText(app: App, text: string) {
	//add the text
	console.log(text)
	//split tthe text into sets of 3 characters
	const characters = text.split("")
	const win = electron.BrowserWindow.getFocusedWindow()
	characters.forEach((char) => {
		win.webContents.sendInputEvent({keyCode: char, type: "char"})
	})
}

function pressKeys(app: App, key1: string, key2: string) {
	//press the keys
	const win = electron.BrowserWindow.getFocusedWindow()
	//sleep for 10ms

	win.webContents.sendInputEvent({keyCode: key2, type: "keyDown", modifiers: [key1]})

	win.webContents.sendInputEvent({keyCode: key2, type: "keyUp"})
}

function pressKey(app: App, key: string) {
	//press the key
	console.log(key)
	const browserWindow = electron.BrowserWindow.getFocusedWindow()
	browserWindow.webContents.sendInputEvent({keyCode: key, type: "keyDown"});
	browserWindow.webContents.sendInputEvent({keyCode: key, type: "keyUp"});
}


function parseMakro(makro: string) {
	//split the makro into commands
	const characters = makro.split("")
	//extract the commands and its arguments
	const parsedCommands: MakroCommand[] = []
	let currentCommand = ""
	let currentArgument = ""
	let isEscaped = false
	let commandStarted = false
	characters.forEach((command) => {
		//if the current character is a [ add that and all the subsequent characters until the next ] to the current command
		switch (command) {
			case "[":
				commandStarted = true
				currentCommand += command
				break
			case "]":
				commandStarted = false
				currentCommand += command
				parsedCommands.push({
					command: MakroCommandType.PressKey,
					argument: currentArgument
				});
				currentArgument = ""
				break
			case "+":
				commandStarted = false
				currentCommand += command
				parsedCommands.push({
					command: MakroCommandType.PressKeys,
					argument: ""
				});
				currentArgument = ""
				break
			case "\"":
				commandStarted = !commandStarted
				currentCommand += command
				if (!commandStarted) {
					parsedCommands.push({
						command: MakroCommandType.AddText,
						argument: currentArgument
					});
				}
				currentArgument = ""
				break
			case "#":
				commandStarted = !commandStarted
				currentCommand += command
				if (!commandStarted) {
					parsedCommands.push({
						command: MakroCommandType.AddComment,
						argument: currentArgument
					});
				}
				currentArgument = ""
				break
			case "\\":
				break
			case ",":
				commandStarted = !commandStarted
				currentCommand += command
				if (!commandStarted) {
					parsedCommands.push({
						command: MakroCommandType.Delay,
						argument: currentArgument
					});
				}
				currentArgument = ""
				break
			default:
				if (commandStarted) {
					currentArgument += command
				}
				break
		}
	});
	return parsedCommands
}


interface MakroCommand {
	command: MakroCommandType,
	argument: string
}

enum MakroCommandType {
	PressKey,
	PressKeys,
	AddText,
	AddComment,
	Repeat,
	Delay
}


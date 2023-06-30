import {App} from "obsidian";
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

export function executeMacro(app: App, makro: string) {
	//parse the input, which is just one long string of the commands above
	const commands = parseMacro(makro)
	//execute the commands
	executeCommands(app, commands)
}

let repeatcounter = 0
async function executeCommands(app: App, commands: MacroCommand[]) {
	console.log(commands)
	for (const command of commands) {
		if (command.command === MacroCommandType.RepeatStart) {
			repeatcounter = parseInt(command.argument);
		}

		//recursively execute the commands inside the repeat command
		if (repeatcounter > 0) {
			for (let i = 0; i < repeatcounter - 1; i++) {
				//get the subarray which is everything between the repeat start and the repeat end
				const insideCommands = commands.slice(commands.indexOf(command) + 1, commands.indexOf(<MacroCommand>commands.find((command) => command.command === MacroCommandType.RepeatEnd)))
				executeCommands(app, insideCommands)
			}
		}

		//check if the current command is a keycode command and the next is a presskeys command
		if (command.command === MacroCommandType.PressKey && commands[commands.indexOf(command) + 1]?.command === MacroCommandType.PressKeys && commands[commands.indexOf(command) + 2]?.command === MacroCommandType.PressKey) {
			//press those two keys together
			pressKeys(app, command.argument, commands[commands.indexOf(command) + 2]?.argument)
		} else {
			//execute the command
			switch (command.command) {
				case MacroCommandType.PressKey:
					pressKey(app, command.argument)
					break
				case MacroCommandType.AddText:
					addText(app, command.argument)
					break
				case MacroCommandType.Delay:
					await waitFor(command.argument)
					break
				case MacroCommandType.AddComment:
					break

			}
		}
	}
}

function waitFor(argument: string) {
	//sleep for the amount of time specified in the argument
	return new Promise(resolve => setTimeout(resolve, parseInt(argument)))
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
	const mods = key1.split(" ")
	win.webContents.sendInputEvent({keyCode: key2, type: "keyDown", modifiers: mods})

	win.webContents.sendInputEvent({keyCode: key2, type: "keyUp"})
}

function pressKey(app: App, key: string) {
	//press the key
	console.log(key)
	const browserWindow = electron.BrowserWindow.getFocusedWindow()
	browserWindow.webContents.sendInputEvent({keyCode: key, type: "keyDown"});
	browserWindow.webContents.sendInputEvent({keyCode: key, type: "keyUp"});
}

/**
 * This horrible monstrosity of a function parses the string of macros int an array of commands
 * @param macro
 * @return {MacroCommand[]} the array of commands
 */
function parseMacro(macro: string) {
	//split the macro into commands
	const characters = macro.split("")
	//extract the commands and its arguments
	const parsedCommands: MacroCommand[] = []
	let currentCommand = ""
	let currentArgument = ""
	let isEscaped = false
	let commandStarted = false
	let commandEscaped = false
	characters.forEach((command) => {
		//if the current character is a [ add that and all the subsequent characters until the next ] to the current command
		switch (command) {
			case "[":
				if(isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					commandStarted = true
					currentCommand += command
					break
				}
			case "]":
				if(isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else if (commandStarted) {
					commandStarted = false
					currentCommand += command
					parsedCommands.push({
						command: MacroCommandType.PressKey,
						argument: currentArgument
					});
					currentArgument = ""
					break
				} else {
					currentArgument += command
					break
				}
			case "+":
				if (isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					commandStarted = false
					currentCommand += command
					parsedCommands.push({
						command: MacroCommandType.PressKeys,
						argument: ""
					});
					currentArgument = ""
					break
				}
			case "\"":
				if (isEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					commandEscaped = true;
					commandStarted = !commandStarted
					currentCommand += command
					if (!commandStarted) {
						parsedCommands.push({
							command: MacroCommandType.AddText,
							argument: currentArgument
						});
						commandEscaped = false;
					}
					currentArgument = ""
					break
				}
			case "#":
				if (isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					commandStarted = !commandStarted
					currentCommand += command
					if (!commandStarted) {
						parsedCommands.push({
							command: MacroCommandType.AddComment,
							argument: currentArgument
						});
					}
					currentArgument = ""
					break
				}
			case "\\":
				isEscaped = true
				break
			case ",":
				if (isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					commandStarted = !commandStarted
					currentCommand += command
					if (!commandStarted) {
						parsedCommands.push({
							command: MacroCommandType.Delay,
							argument: currentArgument
						});
					}
					currentArgument = ""
					break
				}
			//repeat timer start
			case "{":
				if (isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					commandStarted = !commandStarted
					currentCommand += command
					break
				}
			//repeat timer end
			case "}":
				if (isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					commandStarted = false
					currentCommand += command
					if (!commandStarted) {
						parsedCommands.push({
							command: MacroCommandType.RepeatStart,
							argument: currentArgument
						});
					}
					currentArgument = ""
					break
				}
			case "(":
				if (isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					currentCommand += command
					break
				}
			case ")":
				if (isEscaped || commandEscaped){
					currentArgument += command
					isEscaped = false
					break
				} else {
					currentCommand += command
					if (!commandStarted) {
						parsedCommands.push({
							command: MacroCommandType.RepeatEnd,
							argument: ""
						});
					}
					break
				}
			default:
				if (commandStarted) {
					currentArgument += command
				}
				break
		}
	});
	return parsedCommands
}


interface MacroCommand {
	command: MacroCommandType,
	argument: string
}

enum MacroCommandType {
	PressKey,
	PressKeys,
	AddText,
	AddComment,
	RepeatStart,
	RepeatEnd,
	Delay
}


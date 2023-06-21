import {App, Plugin, PluginSettingTab, setIcon, Setting} from 'obsidian';
import {ObsidianTouchBarItem} from "./touchbar";
import {executeMakro} from "./makro";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	touchbarItems: ObsidianTouchBarItem[]
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	touchbarItems: [],
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.updateTouchBar();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	updateTouchBar() {
		const {BrowserWindow, TouchBar} = require('electron').remote

		const items = this.settings.touchbarItems.map((item) => {
			return new TouchBar.TouchBarButton({
				label: item["label"],
				backgroundColor: item["backgroundColor"],
				click: () => {
					executeMakro(this.app, item["makro"])
				}
			})
		});
		const touchbar = new TouchBar({
			items: items
		})

		//get the main window
		const win = BrowserWindow.getFocusedWindow()
		//set the touchbar
		win.setTouchBar(touchbar)
	}

	onunload() {
		//unload all the touchbar items
		const {BrowserWindow} = require('electron').remote
		const win = BrowserWindow.getFocusedWindow()
		win.setTouchBar(null)

		//unload all the listeners
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Touch Bar Items'});
		containerEl.createEl("p", {text: "To add an item to your Touch Bar, click the button below. You can then edit the item in the list below."})

		const modifyOrAddArray = async (item: ObsidianTouchBarItem) => {
			//check for an item with the same id
			const index = this.plugin.settings.touchbarItems.findIndex((element) => element.id === item.id)
			if (index === -1) {
				//add the item to the array
				this.plugin.settings.touchbarItems.push(item)
			} else {
				//replace the item in the array
				this.plugin.settings.touchbarItems[index] = item
			}
			this.plugin.updateTouchBar()
			await this.plugin.saveSettings()
		}
		const renderTouchbarItem = (item: ObsidianTouchBarItem) => {
			const itemEl = itemContainer.createDiv('touchbar-item');
			itemEl.style.display = 'flex';
			itemEl.style.flexDirection = 'row';
			itemEl.style.alignItems = 'center';
			itemEl.style.marginBottom = '10px';
			itemEl.style.justifyContent = 'space-between';

			//create the move buttons
			const moveButtons = itemEl.createDiv();
			moveButtons.style.display = 'flex';
			moveButtons.style.flexDirection = 'column';
			moveButtons.style.alignItems = 'center';
			moveButtons.style.marginRight = '10px';

			const moveUp = moveButtons.createEl('button');
			moveUp.style.backgroundColor = "inherit";
			moveUp.style.border = 'none'
			moveUp.style.outline = 'none'
			moveUp.style.boxShadow = 'none'
			moveUp.style.padding = '0'
			moveUp.style.margin = '0'
			moveUp.style.cursor = 'pointer'
			moveUp.style.marginLeft = 'auto'
			moveUp.style.cursor = 'pointer'
			moveUp.style.height = "20px"
			moveUp.style.opacity = "0.5"
			setIcon(moveUp, 'chevron-up')

			const moveDown = moveButtons.createEl('button');
			moveDown.style.backgroundColor = "inherit";
			moveDown.style.border = 'none'
			moveDown.style.outline = 'none'
			moveDown.style.boxShadow = 'none'
			moveDown.style.padding = '0'
			moveDown.style.margin = '0'
			moveDown.style.cursor = 'pointer'
			moveDown.style.marginLeft = 'auto'
			moveDown.style.height = "20px"
			moveDown.style.opacity = "0.5"
			setIcon(moveDown, 'chevron-down')

			moveUp.addEventListener("mouseover", () => {
				moveUp.style.opacity = "1"
			})

			moveUp.addEventListener("mouseout", () => {
				moveUp.style.opacity = "0.5"
			})

			moveDown.addEventListener("mouseover", () => {
				moveDown.style.opacity = "1"
			})

			moveDown.addEventListener("mouseout", () => {
				moveDown.style.opacity = "0.5"
			})

			moveUp.addEventListener('click', async () => {
				//move the item up in the array
				const index = this.plugin.settings.touchbarItems.findIndex((element) => element.id === item.id)
				if (index > 0) {
					this.plugin.settings.touchbarItems.splice(index - 1, 0, this.plugin.settings.touchbarItems.splice(index, 1)[0])
					this.plugin.updateTouchBar()
					await this.plugin.saveSettings()
					//move the item visually up
					itemEl.previousSibling?.before(itemEl)
				}
			})
			moveDown.addEventListener('click', async () => {
				//move the item down in the array
				const index = this.plugin.settings.touchbarItems.findIndex((element) => element.id === item.id)
				if (index < this.plugin.settings.touchbarItems.length - 1) {
					this.plugin.settings.touchbarItems.splice(index + 1, 0, this.plugin.settings.touchbarItems.splice(index, 1)[0])
					this.plugin.updateTouchBar()
					await this.plugin.saveSettings()
					//move the item visually down
					itemEl.nextSibling?.after(itemEl)
				}

			})

			//create the input fields
			const labelIn = itemEl.createEl("input", {
				type: "text",
				value: item['label']
			})
			labelIn.style.marginRight = '10px'
			labelIn.placeholder = 'Label'

			const colorIn = itemEl.createEl("input", {
				type: "color",
				value: item['backgroundColor'],
			});
			colorIn.style.marginRight = '10px'
			colorIn.placeholder = 'Background Color'

			const makroIn = itemEl.createEl("input", {
				type: "text",
				value: item['makro'],
			});
			makroIn.style.marginRight = '10px'
			makroIn.placeholder = 'Macro'
			makroIn.style.width = '100%'

			const removeButton = itemEl.createEl('button');
			removeButton.style.backgroundColor = "inherit";
			removeButton.style.border = 'none'
			removeButton.style.outline = 'none'
			removeButton.style.boxShadow = 'none'
			removeButton.style.padding = '0'
			removeButton.style.margin = '0'
			removeButton.style.cursor = 'pointer'
			removeButton.style.marginLeft = 'auto'
			removeButton.style.opacity = "0.5"
			setIcon(removeButton, 'x')

			removeButton.addEventListener("mouseover", () => {
				removeButton.style.opacity = "1"
				removeButton.style.color = "red"
			});

			removeButton.addEventListener("mouseout", () => {
				removeButton.style.opacity = "0.5"
				removeButton.style.color = "inherit"
			});

			removeButton.onclick = async () => {
				//remove the item
				this.plugin.settings.touchbarItems = this.plugin.settings.touchbarItems.filter((i) => i !== item);
				await this.plugin.saveSettings();
				this.plugin.updateTouchBar()
				itemEl.remove();
			}

			labelIn.onchange = async () => {
				item["label"] = labelIn.value
				await modifyOrAddArray(item)
			}

			colorIn.onchange = async () => {
				item["backgroundColor"] = colorIn.value
				await modifyOrAddArray(item)
			}

			makroIn.onchange = async () => {
				item["makro"] = makroIn.value
				await modifyOrAddArray(item)
			}
		}

		new Setting(containerEl)
			.setName('Add Touch Bar item')
			.setDesc('Click the "+" button to start creating a new Touch Bar item.')
			.addButton(cb => {
				cb.setButtonText('Add')
					.onClick(async () => {
						renderTouchbarItem(new ObsidianTouchBarItem('', '#FFFFFF', ""))
					})
					.setTooltip('Add a new touchbar item')
					.setIcon('plus')
					.setCta()
			})

		const itemContainer = containerEl.createEl('div');
		itemContainer.createEl('h2', {text: 'Current Touch Bar Items'});

		const touchbarItems = this.plugin.settings.touchbarItems;
		//list all the loaded items
		console.log(touchbarItems)
		for (let i = 0; i < touchbarItems.length; i++) {
			renderTouchbarItem(touchbarItems[i]);
		}


		//add divider
		containerEl.createEl('hr');
		// containerEl.style.overflow = "hidden"
		//Makro section

		containerEl.createEl("h2", {text: "Macros"})
		const description = containerEl.createEl("p", {text: "Use macros to give your Touch Bar items functionality, but be careful as these can have the ability to modify files in unintended ways! "})
		description.style.fontSize = "0.9rem"
		description.style.opacity = "0.7"
		description.createEl("a", {
			text: "List of available keycodes",
			href: "https://www.electronjs.org/docs/latest/api/accelerator#available-key-codes",
		})

		const macroTable = containerEl.createEl("table")
		macroTable.style.width = "100%"
		macroTable.style.marginBottom = "10px"
		macroTable.style.fontSize = "0.9rem"
		//add border
		macroTable.style.border = "2px solid var(--background-secondary)"
		macroTable.style.borderRadius = "5px"
		macroTable.style.padding = "10px"
		macroTable.style.borderCollapse = "collapse"
		const macroTableHead = macroTable.createEl("thead")
		const macroTableHeadRow = macroTableHead.createEl("tr")
		const macroTableHeadRowName = macroTableHeadRow.createEl("th")
		const macroTableHeadRowName2 = macroTableHeadRow.createEl("th")
		const macroTableHeadRowName3 = macroTableHeadRow.createEl("th")
		macroTableHeadRowName.setText("Syntax")
		macroTableHeadRowName2.setText("Description")
		macroTableHeadRowName3.setText("Example")
		const macroTableBody = macroTable.createEl("tbody")


		//load the syntax names and descriptions from macro_desc.json
		const { macros } = require('./macro_desc.json')

		//loop through the makro descriptions and add them to the table
		for (let i = 0; i < macros.length; i++) {
			const row = macroTableBody.createEl("tr")
			const name = row.createEl("td")
			const desc = row.createEl("td")
			const example = row.createEl("td")
			name.setText(macros[i]["syntax"])
			desc.setText(macros[i]["description"])
			example.setText(macros[i]["example"])

			Array.from(row.children).map((child) => {
				(child as any).style.border = "2px solid var(--background-secondary)"
			})
			Array.from(row.children).map((child) => {
				(child as any).style.padding = "10px"
			});

		}

	}

}



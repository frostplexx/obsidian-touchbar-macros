import {App, Plugin, PluginSettingTab, setIcon, Setting} from 'obsidian';
import {ObsidianTouchBarItem, SerializedTouchBarItem} from "./touchbarItems/touchBarItems";
import {executeMacro} from "./macro";
import {deserializeTouchBarItem} from "./touchbarItems/touchBarItems.utils";
import {ObsidianTouchBarButton, TouchBarButtonProperties} from "./touchbarItems/items/button";
import {ObsidianTouchBarLabel, TouchBarLabelProperties} from "./touchbarItems/items/label";


interface TouchbarPluginSettings {
	touchbarItems: SerializedTouchBarItem[]
}

const DEFAULT_SETTINGS: TouchbarPluginSettings = {
	touchbarItems: [],
}

export default class TouchBarMacros extends Plugin {
	settings: TouchbarPluginSettings;

	async onload() {
		await this.loadSettings();

		this.updateTouchBar();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TouchBarSettingTab(this.app, this));
	}

	updateTouchBar() {
		const {BrowserWindow, TouchBar} = require('electron').remote

		// load all the items from the settings
		const items = this.settings.touchbarItems.map((item) => {
			return deserializeTouchBarItem(item).getDisplayAbleItem()

		});

		if(items.length === 0) return; //don't do anything if there are no items

		//get the main window
		const win = BrowserWindow.getFocusedWindow()
		//set the touchbar
		win.setTouchBar(new TouchBar({
			items: items
		}))
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

class TouchBarSettingTab extends PluginSettingTab {
	plugin: TouchBarMacros;

	constructor(app: App, plugin: TouchBarMacros) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Touch Bar Items'});
		containerEl.createEl("p", {text: "To add an item to your Touch Bar, click the button below. You can then edit the item in the list below."})

		const modifyOrAddArray = async (item: ObsidianTouchBarButton) => {
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

		/**
		 * Creates a new touchbar button item for the user to fill out
		 * TODO rewrite this function to support all touchbar items
		 * @param item
		 */
		const createTouchbarItem = (item: ObsidianTouchBarItem) => {
			const itemEl = itemContainer.createDiv('touchbar-item');

			//create the move buttons
			const moveButtons = itemEl.createDiv("move-buttons-div");


			const moveUp = moveButtons.createEl('button', "touchbar-item-button");
			setIcon(moveUp, 'chevron-up')

			const moveDown = moveButtons.createEl('button', "touchbar-item-button");
			setIcon(moveDown, 'chevron-down')

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
				value: item["properties"]['label'],
			});
			labelIn.classList.add('touchbar-item-input')
			labelIn.placeholder = 'Label'

			const colorIn = itemEl.createEl("input", {
				type: "color",
				value: item["properties"]['backgroundColor'],
			});
			colorIn.classList.add('touchbar-item-input')
			colorIn.placeholder = 'Background Color'

			const makroIn = itemEl.createEl("input", {
				type: "text",
				value: item["properties"]['macro'],
			});
			makroIn.classList.add('touchbar-item-input')
			makroIn.classList.add("wide-input")
			makroIn.placeholder = 'Macro'

			const removeButton = itemEl.createEl('button', "touchbar-item-button remove-button");
			setIcon(removeButton, 'x')

			removeButton.onclick = async () => {
				//remove the item
				this.plugin.settings.touchbarItems = this.plugin.settings.touchbarItems.filter((i) => i !== item);
				await this.plugin.saveSettings();
				this.plugin.updateTouchBar()
				itemEl.remove();
			}

			labelIn.onchange = async () => {
				item["properties"]["label"] = labelIn.value
				await modifyOrAddArray(item)
			}

			colorIn.onchange = async () => {
				item["properties"]["backgroundColor"] = colorIn.value
				await modifyOrAddArray(item)
			}

			makroIn.onchange = async () => {
				item["properties"]["macro"] = makroIn.value
				await modifyOrAddArray(item)
			}
		}

		//this is a dropdown that shows up when clicking the add button to select the type of touchbar item you want to add

		new Setting(containerEl)
			.setName('Add Touch Bar item')
			.setDesc('Click the "+" button to start creating a new Touch Bar item.')
			.addButton(cb => {
				cb.setButtonText('Add')
					.onClick(async (event) => {
						//create a div containing all the options under the mouse cursor
						const mousePos = {x: event.offsetX, y: event.offsetY}
						const dropdown = containerEl.createDiv('touchbar-dropdown');
						console.log(mousePos)
						//move the item under the mouse cursor
						dropdown.style.right = mousePos.x + 'px'
						dropdown.style.top = mousePos.y + 'px'

						dropdown.addEventListener('mouseleave', () => {
							dropdown.remove()
						});

						//create the buttons
						const button = (text: string,  onClick: () => void) => {
							const button = dropdown.createEl('button', 'touchbar-dropdown-button');
							button.createEl('span', {text: text});
							button.classList.add('touchbar-dropdown-button')
							button.addEventListener('click', () => {
								onClick()
								dropdown.remove()
							})
						}

						button('Button', () => {
							createTouchbarItem(new ObsidianTouchBarButton({label: 'Button', macro: ''} as TouchBarButtonProperties))
						});

						button('Label', () => {
							createTouchbarItem(new ObsidianTouchBarLabel({label: 'Label'} as TouchBarLabelProperties))
						});

						button('Spacer', () => {

						});

						button('Slider', () => {

						});

						button('Segmented Control', () => {

						});

						button('Popover', () => {

						});

						button('Scrubber', () => {

						});


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
			createTouchbarItem(touchbarItems[i] as ObsidianTouchBarButton);
		}


		//add divider
		containerEl.createEl('hr');
		//Makro section

		containerEl.createEl("h2", {text: "Macros"})
		const description = containerEl.createEl("p", {text: "Use macros to give your Touch Bar items functionality, but be careful as these can have the ability to modify files in unintended ways! If you unsure please consider trying out the macro in a new vault first. "})
		description.classList.add("touchbar-settings-description")
		description.createEl("a", {
			text: "List of available keycodes",
			href: "https://www.electronjs.org/docs/latest/api/accelerator#available-key-codes",
		})

		const macroTable = containerEl.createEl("table", "touchbar-macro-table")
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
			const name = row.createEl("td", "touchbar-macro-table-border")
			const desc = row.createEl("td", "touchbar-macro-table-border")
			const example = row.createEl("td", "touchbar-macro-table-border")
			name.setText(macros[i]["syntax"])
			desc.setText(macros[i]["description"])
			example.setText(macros[i]["example"])
		}

	}

}



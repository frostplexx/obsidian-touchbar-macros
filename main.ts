import {App, Modal, Plugin, PluginSettingTab, setIcon, Setting} from 'obsidian';
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

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
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

		containerEl.createEl('h2', {text: 'Add Touchbar Items'});
		containerEl.createEl("p", {text: "To add an item to your touchbar, first create a makro, then a new item and assign the makro to it."})

		const modifyOrAddArray = (item: ObsidianTouchBarItem) => {
			//check for an item with the same id
			const index = this.plugin.settings.touchbarItems.findIndex((element) => element.id === item.id)
			if(index === -1){
				//add the item to the array
				this.plugin.settings.touchbarItems.push(item)
			} else {
				//replace the item in the array
				this.plugin.settings.touchbarItems[index] = item
			}
			this.plugin.updateTouchBar()
			this.plugin.saveSettings()
		}
		const renderTouchbarItem = (item: ObsidianTouchBarItem) => {
			const itemEl = itemContainer.createDiv('touchbar-item');
			itemEl.style.display = 'flex';
			itemEl.style.flexDirection = 'row';
			itemEl.style.alignItems = 'start';
			itemEl.style.marginBottom = '10px';
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
			makroIn.placeholder = 'Makro'
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
			setIcon(removeButton, 'x')

			removeButton.onclick = () => {
				//remove the item
				this.plugin.settings.touchbarItems = this.plugin.settings.touchbarItems.filter((i) => i !== item);
				this.plugin.saveSettings();
				this.plugin.updateTouchBar()
				itemEl.remove();
			}

			labelIn.onchange = () => {
				item["label"] = labelIn.value
				modifyOrAddArray(item)
			}

			colorIn.onchange = () => {
				item["backgroundColor"] = colorIn.value
				modifyOrAddArray(item)
			}

			makroIn.onchange = () => {
				item["makro"] = makroIn.value
				modifyOrAddArray(item)
			}
		}

		new Setting(containerEl)
			.setName('Add Touchbar Item')
			.setDesc('Add a new touchbar item')
			.addButton(cb => {
				cb.setButtonText('Add')
					.onClick(async () => {
						renderTouchbarItem(new ObsidianTouchBarItem('', '#FFFFFF', ""))
					})
			})

		const itemContainer = containerEl.createEl('div');
		itemContainer.createEl('h2', {text: 'Current Touchbar Items'});

		const touchbarItems = this.plugin.settings.touchbarItems;
		//list all the loaded items
		console.log(touchbarItems)
		for (let i = 0; i < touchbarItems.length; i++) {
			renderTouchbarItem(touchbarItems[i]);
		}


		//add divider
		containerEl.createEl('hr');
		containerEl.style.overflow = "hidden"
		//Makro section

		containerEl.createEl("h2", {text: "Makros"})
		const description = containerEl.createEl("p", {text: "Use makros to give your touchbar items functionality."})
		description.style.fontSize = "0.9rem"
		description.style.opacity = "0.7"

		const makroTable = containerEl.createEl("table")
		makroTable.style.width = "100%"
		makroTable.style.marginBottom = "10px"
		makroTable.style.fontSize = "0.9rem"
		makroTable.style.textAlign = "center"
		const makroTableHead = makroTable.createEl("thead")
		const makroTableHeadRow = makroTableHead.createEl("tr")
		const makroTableHeadRowName = makroTableHeadRow.createEl("th")
		const makroTableHeadRowName2 = makroTableHeadRow.createEl("th")
		const makroTableHeadRowName3 = makroTableHeadRow.createEl("th")
		makroTableHeadRowName.setText("Syntax")
		makroTableHeadRowName2.setText("Description")
		makroTableHeadRowName3.setText("Example")


		//load the syntax names and descriptions from macro_desc.json
		const { makros } = require('./makro_desc.json')

		//loop through the makro descriptions and add them to the table
		for (let i = 0; i < makros.length; i++) {
			const row = makroTable.createEl("tr")
			const name = row.createEl("td")
			const desc = row.createEl("td")
			const example = row.createEl("td")
			name.setText(makros[i]["syntax"])
			desc.setText(makros[i]["description"])
			example.setText(makros[i]["example"])
		}


	}

}



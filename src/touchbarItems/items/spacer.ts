import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";

const {TouchBar} = require('electron').remote


export class ObsidianTouchBarSpacer extends ObsidianTouchBarItem {
	constructor(properties: TouchBarSpacerProperties, id = "") {
		super(properties, id);
		this.type = TouchBarItemType.ObsidianTouchBarSpacer;
	}

	getItemForElectron(): any {
		return new TouchBar.TouchBarSpacer({
			size: this.properties.size
		})
	}

	getItemForDisplay(): HTMLElement {
		const itemEl = document.createElement("div");
		itemEl.classList.add('touchbar-item-list')
		const sizeSelector = itemEl.createEl("select")
		sizeSelector.name = "Size"

		for (let size in ObsidianTouchBarSpacerSize) {
			const option = sizeSelector.createEl("option")
			option.value = size
			option.text = size.charAt(0).toUpperCase() + size.slice(1)
		}

		sizeSelector.classList.add("wide-input")
		sizeSelector.classList.add('touchbar-item-input')

		// sizeSelector.onselect = async () => {
		// 	console.log(sizeSelector.value)
		// 	this.properties.size = sizeSelector.value
		// }

		sizeSelector.addEventListener("change", () => {
			console.log(sizeSelector.value)
			this.properties.size = sizeSelector.value
		})

		return itemEl;
	}

}

export interface TouchBarSpacerProperties {
	size: ObsidianTouchBarSpacerSize
}

export enum ObsidianTouchBarSpacerSize {
	small = "small",
	large = "large",
	flexible = "flexible"
}

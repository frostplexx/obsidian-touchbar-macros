import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";

const {TouchBar} = require('electron').remote


export class ObsidianTouchBarLabel extends ObsidianTouchBarItem {
	constructor(properties: TouchBarLabelProperties, id: string = "") {
		super(properties, id);
		this.type = TouchBarItemType.ObsidianTouchBarLabel;
	}

	getItemForElectron(): any {
		return new TouchBar.TouchBarLabel({
			label: this.properties.label,
		})
	}

	getItemForDisplay(): HTMLElement {
		const itemEl = document.createElement("div");
		itemEl.classList.add('touchbar-item-list')
		const labelIn = itemEl.createEl("input", {
			type: "text",
			value: this.properties.label,
		});
		labelIn.classList.add("wide-input")
		labelIn.classList.add('touchbar-item-input')
		labelIn.placeholder = 'Label'

		labelIn.onchange = async () => {
			this.properties.label = labelIn.value
		}

		return itemEl;
	}

}

export interface TouchBarLabelProperties {
	label: string
}

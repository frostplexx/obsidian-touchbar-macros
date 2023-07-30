import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";

const {TouchBar} = require('electron').remote

export class ObsidianTouchBarPopover extends ObsidianTouchBarItem {
	constructor(properties: TouchBarPopoverProperties, id: string = "") {
		super(properties, id);
		this.type = TouchBarItemType.ObsidianTouchBarPopover;
	}

	getItemForElectron(): any {
		return new TouchBar.TouchBarPopover({
			label: this.properties.label,
			icon: this.properties.icon,
			items: this.properties.items,
			showCloseButton: this.properties.showCloseButton
		})
	}

	getItemForDisplay(): HTMLElement {
		const itemEl = document.createElement("div");
		itemEl.classList.add('touchbar-item-list')

		//create the input fields
		const labelIn = itemEl.createEl("input", {
			type: "text",
			value: this.properties.label,
		});
		labelIn.classList.add('touchbar-item-input')
		labelIn.placeholder = 'Label (Optional)'

		const check = itemEl.createEl("input", {
			type: "checkbox",
			value: this.properties.showCloseButton
		})
		check.name = "Show close button"
		check.classList.add('touchbar-item-input')

		check.onchange = async () => {
			this.properties.showCloseButton = check.value
		}

		labelIn.onchange = async () => {
			this.properties.label = labelIn.value
		}

		return itemEl;
	}

}

export interface TouchBarPopoverProperties {
	label: string,
	icon: null, //TODO implement nativeIcon
	items: any,
	showCloseButton: boolean
}

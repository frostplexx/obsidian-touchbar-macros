import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";
import {executeMacro} from "../../macro";

const {TouchBar} = require('electron').remote

/**
 * Represents a touch bar button
 */
export class ObsidianTouchBarButton extends ObsidianTouchBarItem {
	constructor(properties: TouchBarButtonProperties) {
		super(properties);
		this.type = TouchBarItemType.ObsidianTouchBarButton;
	}

	getItemForElectron(): any {
		return new TouchBar.TouchBarButton({
			label: this.properties.label,
			backgroundColor: this.properties.backgroundColor,
			click: () => {
				executeMacro(this.app, this.properties.macro)
			}
		});
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
		labelIn.placeholder = 'Label'

		const colorIn = itemEl.createEl("input", {
			type: "color",
			value: this.properties.backgroundColor,
		});
		colorIn.classList.add('touchbar-item-input')
		colorIn.placeholder = 'Background Color'

		const makroIn = itemEl.createEl("input", {
			type: "text",
			value: this.properties.macro,
		});
		makroIn.classList.add('touchbar-item-input')
		makroIn.classList.add("wide-input")
		makroIn.placeholder = 'Macro'


		labelIn.onchange = async () => {
			this.properties.label = labelIn.value
		}

		colorIn.onchange = async () => {
			this.properties.backgroundColor = colorIn.value
		}

		makroIn.onchange = async () => {
			this.properties.macro = makroIn.value
		}
		return itemEl
	}
}

export interface TouchBarButtonProperties {
	label: string
	backgroundColor: string
	macro: string
}



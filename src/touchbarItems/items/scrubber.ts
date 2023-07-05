import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";

const {TouchBar} = require('electron').remote

//INFO: This could be used for scrolling through all the documents?
export class ObsidianTouchBarScrubber extends ObsidianTouchBarItem {
	constructor(properties: TouchBarScrubberProperties) {
		super(properties);
		this.type = TouchBarItemType.ObsidianTouchBarScrubber;
	}

	getItemForElectron(): any {
		return new TouchBar.TouchBarScrubber({
			items: this.properties.items,
			select: this.properties.select,
			highlight: this.properties.highlight,
			selectedStyle: this.properties.selectedStyle,
			overlayStyle: this.properties.overlayStyle,
			showArrowButtons: this.properties.showArrowButtons,
			mode: this.properties.mode,
			continuous: this.properties.continuous
		})
	}

	getItemForDisplay(): HTMLElement {
		const itemEl = document.createElement("div");
		itemEl.classList.add('touchbar-item-list')


		const selectedStyleSelector = itemEl.createEl("select")
		selectedStyleSelector.name = "selected Style"

		for (let size in TouchBarScrubberSelectedStyle) {
			const option = selectedStyleSelector.createEl("option")
			option.value = size
			option.text = size.charAt(0).toUpperCase() + size.slice(1)
		}

		selectedStyleSelector.classList.add("wide-input")
		selectedStyleSelector.classList.add('touchbar-item-input')


		const overlayStyleSelector = itemEl.createEl("select")
		overlayStyleSelector.name = "overlay Style"

		for (let size in TouchBarScrubberSelectedStyle) {
			const option = overlayStyleSelector.createEl("option")
			option.value = size
			option.text = size.charAt(0).toUpperCase() + size.slice(1)
		}

		overlayStyleSelector.classList.add("wide-input")
		overlayStyleSelector.classList.add('touchbar-item-input')


		const modeSelector = itemEl.createEl("select")
		modeSelector.name = "Mode"

		for (let size in TouchBarScrubberMode) {
			const option = modeSelector.createEl("option")
			option.value = size
			option.text = size.charAt(0).toUpperCase() + size.slice(1)
		}

		modeSelector.classList.add("wide-input")
		modeSelector.classList.add('touchbar-item-input')


		const check = itemEl.createEl("input", {
			type: "checkbox",
			value: this.properties.showArrowButtons
		})
		check.name = "Show arrow buttons"
		check.classList.add('touchbar-item-input')
		check.onchange = async () => {
			this.properties.showArrowButtons = check.value
		}

		const cont = itemEl.createEl("input", {
			type: "checkbox",
			value: this.properties.continuous
		})
		cont.name = "Show arrow buttons"
		cont.classList.add('touchbar-item-input')

		cont.onchange = async () => {
			this.properties.continuous = cont.value
		}

		selectedStyleSelector.addEventListener("change", () => {
			this.properties.selectedStyle = selectedStyleSelector.value
		})

		overlayStyleSelector.addEventListener("change", () => {
			this.properties.overlayStyleSelector = overlayStyleSelector.value
		})

		modeSelector.addEventListener("change", () => {
			this.properties.modeSelector = modeSelector.value
		})

		return itemEl;
	}

}

export interface TouchBarScrubberProperties {
	items: ScrubberItem[],
	select: () => {},
	highlight: () => {},
	selectedStyle: TouchBarScrubberSelectedStyle,
	overlayStyle: TouchBarScrubberSelectedStyle,
	showArrowButtons: boolean,
	mode: TouchBarScrubberMode,
	continuous: boolean
}

export enum TouchBarScrubberMode {
	fixed = "fixed",
	free = "free"
}

export enum TouchBarScrubberSelectedStyle {
	background = "background",
	outline = "outline",
	none = "none",
}

export class ScrubberItem {
	label: string
	icon: null

	constructor(label: string, icon: null) {
		this.icon = icon;
		this.label = label;
	}


}

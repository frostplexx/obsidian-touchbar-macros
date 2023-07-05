import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";

const {TouchBar} = require('electron').remote


export class ObsidianTouchBarSlider extends ObsidianTouchBarItem {
	constructor(properties: TouchBarSliderProperties) {
		super(properties);
		this.type = TouchBarItemType.ObsidianTouchBarSlider;
	}

	getItemForElectron(): any {
		return new TouchBar.TouchBarSlider({
			label: this.properties.label,
			minValue: this.properties.minValue,
			maxValue: this.properties.maxValue,
			change: this.properties.change
		})
	}

	getItemForDisplay(): HTMLElement {
		const itemEl = document.createElement("div");
		itemEl.classList.add('touchbar-item-list')


		const labelIn = itemEl.createEl("input", {
			type: "text",
			value: this.properties.label,
		});
		labelIn.classList.add('touchbar-item-input')
		labelIn.placeholder = 'Label (Optional)'


		const minValueIn = itemEl.createEl("input", {
			type: "number",
			value: this.properties.minValue,
		});
		minValueIn.classList.add('touchbar-item-input')
		minValueIn.placeholder = 'Min Value'


		const maxValueIn = itemEl.createEl("input", {
			type: "number",
			value: this.properties.maxValue,
		});
		maxValueIn.classList.add('touchbar-item-input')
		maxValueIn.placeholder = 'Max Value'


		labelIn.addEventListener("change", () => {
			this.properties.label = labelIn.value
		})

		minValueIn.addEventListener("change", () => {
			this.properties.minValue = minValueIn.value
		})

		maxValueIn.addEventListener("change", () => {
			this.properties.maxValue = maxValueIn.value
		})
		return itemEl;
	}

}

export interface TouchBarSliderProperties {
	label: string,
	value: number,
	minValue: number
	maxValue: number,
	change: () => {}
}


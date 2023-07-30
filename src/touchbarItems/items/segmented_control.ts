import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";
const {TouchBar} = require('electron').remote


export class ObsidianTouchBarSegmentedControl extends ObsidianTouchBarItem {
	constructor(properties: TouchBarSegmentedControlProperties, id: string = "") {
		super(properties, id);
		this.type = TouchBarItemType.ObsidianTouchBarSegmentedControl;
	}

	getItemForElectron(): any {
		return new TouchBar.TouchBarSegmentedControl({
			segmentStyle: this.properties.segmentStyle,
			mode: this.properties.mode,
			segments: this.properties.segments,
			selectedIndex: this.properties.selectedIndex,
			change: this.properties.change
		})
	}

	getItemForDisplay(): HTMLElement {
		const itemEl = document.createElement("div");
		itemEl.classList.add('touchbar-item-list')


		const segmentStyleSelector = itemEl.createEl("select")
		segmentStyleSelector.name = "Segment Style"

		for(let size in SegmentedControlSegmentStyle) {
			const option = segmentStyleSelector.createEl("option")
			option.value = size
			option.text = size.charAt(0).toUpperCase() + size.slice(1).replace("_", " ")
		}

		segmentStyleSelector.classList.add("wide-input")
		segmentStyleSelector.classList.add('touchbar-item-input')

		segmentStyleSelector.addEventListener("change", () => {
			this.properties.segmentStyle = segmentStyleSelector.value
		})


		const mode  = itemEl.createEl("select")
		mode.name = "Mode"

		for(let size in SegmentedControlMode) {
			const option = mode.createEl("option")
			option.value = size
			option.text = size.charAt(0).toUpperCase() + size.slice(1).replace("_", " ") //TODO make this a global function
		}

		mode.classList.add("wide-input")
		mode.classList.add('touchbar-item-input')

		mode.addEventListener("change", () => {
			this.properties.mode = mode.value
		})



		return itemEl;
	}

}


export class SegmentedControlSegment {
	label: string
	icon: null
	enabled: boolean
}


export interface TouchBarSegmentedControlProperties {
	segmentStyle: SegmentedControlSegmentStyle
	mode: SegmentedControlMode
	segments: SegmentedControlSegment[],
	selectedIndex: number
	change: () => {}

}

export enum SegmentedControlMode {
	single = "single",
	multiple = "multiple",
	buttons = "buttons"
}

export enum SegmentedControlSegmentStyle{
	automatic = "automatic",
	rounded = "rounded",
	textured_rounded = "textured-rounded",
	round_rect = "round-rect",
	textured_square = "textured-square",
	capsule = "capsule",
	small_square = "small-square",
	separated = "separated"
}

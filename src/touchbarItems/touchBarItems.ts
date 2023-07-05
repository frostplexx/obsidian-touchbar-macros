import {executeMacro} from "../macro";
import {App} from "obsidian";


/**
 * Abstract class reperesenting a touch bar item
 */
export abstract class ObsidianTouchBarItem {
	properties: any;
	type: TouchBarItemType;
	id: string;
	app: App;

	protected constructor(properties: any, id: string = "") {
		this.properties = properties;
		this.id = id === "" ? this.generateID() : id;
	}

	generateID(): string {
		return Math.random().toString(36).substring(7);
	}

	/**
	 * Returns the properties of the touch bar item
	 * @returns {any}
	 */
	getProperties(): any {
		return this.properties;
	};

	/**
	 * Returns the corresponding object, that can directly be put into the touchbar array
	 */
	abstract getItemForElectron(): any;

	/**
	 * Returns the corresponding HTML element, that can be displayed in the settings
	 * @returns {HTMLElement}
	 */
	abstract getItemForDisplay(): HTMLElement;
}


/**
 * Represents the serialized version of a touch bar item
 */
export interface SerializedTouchBarItem {
	type: TouchBarItemType
	id: string
	properties: any
}


/**
 * All the possible types of touch bar items
 */
export enum TouchBarItemType {
	ObsidianTouchBarButton = "ObsidianTouchBarButton",
	ObsidianTouchBarColorPicker = "ObsidianTouchBarColorPicker",
	ObsidianTouchBarGroup = "ObsidianTouchBarGroup",
	ObsidianTouchBarLabel = "ObsidianTouchBarLabel",
	ObsidianTouchBarPopover = "ObsidianTouchBarPopover",
	ObsidianTouchBarScrubber = "ObsidianTouchBarScrubber",
	ObsidianTouchBarSegmentedControl = "ObsidianTouchBarSegmentedControl",
	ObsidianTouchBarSlider = "ObsidianTouchBarSlider",
	ObsidianTouchBarSpacer = "ObsidianTouchBarSpacer",
}

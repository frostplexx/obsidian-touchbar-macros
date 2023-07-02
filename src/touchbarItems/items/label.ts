import {ObsidianTouchBarItem, TouchBarItemType} from "../touchBarItems";
const {TouchBar} = require('electron').remote


export class ObsidianTouchBarLabel extends ObsidianTouchBarItem {
	constructor(properties: TouchBarLabelProperties) {
		super(properties);
		this.type = TouchBarItemType.ObsidianTouchBarLabel;
	}

	getDisplayAbleItem(): any {
		return new TouchBar.TouchBarLabel({
			label: this.properties["label"]
		})
	}

}

export interface TouchBarLabelProperties {
	label: string
}

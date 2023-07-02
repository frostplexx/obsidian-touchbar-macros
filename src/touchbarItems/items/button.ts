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

	getDisplayAbleItem(): any {
		return new TouchBar.TouchBarButton({
			label: this.properties["label"],
			backgroundColor: this.properties["backgroundColor"],
			click: () => {
				executeMacro(this.app, this.properties["macro"])
			}
		});
	}
}

export interface TouchBarButtonProperties {
	label: string
	backgroundColor: string
	macro: string
}



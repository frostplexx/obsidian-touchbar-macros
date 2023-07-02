import {SerializedTouchBarItem, TouchBarItemType} from "./touchBarItems";
import {ObsidianTouchBarButton} from "./items/button";

export function deserializeTouchBarItem(serializedItem: SerializedTouchBarItem) {
	switch (serializedItem.type) {
		case TouchBarItemType.ObsidianTouchBarButton:
			return new ObsidianTouchBarButton(serializedItem.properties);
		default:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
	}
}

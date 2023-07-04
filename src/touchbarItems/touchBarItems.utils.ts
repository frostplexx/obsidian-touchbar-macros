import {SerializedTouchBarItem, TouchBarItemType} from "./touchBarItems";
import {ObsidianTouchBarButton} from "./items/button";
import {ObsidianTouchBarLabel} from "./items/label";

export function deserializeTouchBarItem(serializedItem: SerializedTouchBarItem) {
	switch (serializedItem.type) {
		case TouchBarItemType.ObsidianTouchBarButton:
			return new ObsidianTouchBarButton(serializedItem.properties);
		case TouchBarItemType.ObsidianTouchBarLabel:
			return new ObsidianTouchBarLabel(serializedItem.properties);
		case TouchBarItemType.ObsidianTouchBarColorPicker:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarGroup:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarPopover:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarScrubber:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarSegmentedControl:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarSlider:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarSpacer:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		default:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
	}
}

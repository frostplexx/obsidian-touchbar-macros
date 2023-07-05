import {SerializedTouchBarItem, TouchBarItemType} from "./touchBarItems";
import {ObsidianTouchBarButton} from "./items/button";
import {ObsidianTouchBarLabel} from "./items/label";
import {ObsidianTouchBarSpacer} from "./items/spacer";
import {ObsidianTouchBarSlider} from "./items/slider";
import {ObsidianTouchBarSegmentedControl} from "./items/segmented_control";
import {ObsidianTouchBarPopover} from "./items/popover";
import {ObsidianTouchBarScrubber} from "./items/scrubber";

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
			return new ObsidianTouchBarPopover(serializedItem.properties)
		case TouchBarItemType.ObsidianTouchBarScrubber:
			return new ObsidianTouchBarScrubber(serializedItem.properties);
		case TouchBarItemType.ObsidianTouchBarSegmentedControl:
			return new ObsidianTouchBarSegmentedControl(serializedItem.properties);
		case TouchBarItemType.ObsidianTouchBarSlider:
			return new ObsidianTouchBarSlider(serializedItem.properties);
		case TouchBarItemType.ObsidianTouchBarSpacer:
			return new ObsidianTouchBarSpacer(serializedItem.properties);
		default:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
	}
}

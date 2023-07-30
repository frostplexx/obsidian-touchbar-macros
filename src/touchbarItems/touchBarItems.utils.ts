import {ObsidianTouchBarItem, SerializedTouchBarItem, TouchBarItemType} from "./touchBarItems";
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
			return new ObsidianTouchBarButton(serializedItem.properties, serializedItem.id);
		case TouchBarItemType.ObsidianTouchBarLabel:
			return new ObsidianTouchBarLabel(serializedItem.properties, serializedItem.id);
		case TouchBarItemType.ObsidianTouchBarColorPicker:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarGroup:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
		case TouchBarItemType.ObsidianTouchBarPopover:
			return new ObsidianTouchBarPopover(serializedItem.properties, serializedItem.id)
		case TouchBarItemType.ObsidianTouchBarScrubber:
			return new ObsidianTouchBarScrubber(serializedItem.properties, serializedItem.id);
		case TouchBarItemType.ObsidianTouchBarSegmentedControl:
			return new ObsidianTouchBarSegmentedControl(serializedItem.properties, serializedItem.id);
		case TouchBarItemType.ObsidianTouchBarSlider:
			return new ObsidianTouchBarSlider(serializedItem.properties, serializedItem.id);
		case TouchBarItemType.ObsidianTouchBarSpacer:
			return new ObsidianTouchBarSpacer(serializedItem.properties, serializedItem.id);
		default:
			throw new Error("Unknown touch bar item type: " + serializedItem.type);
	}
}

/**
 *
 * @param item
 */
export function getTouchBarItemIconAndName(item: ObsidianTouchBarItem){
	switch (item.type) {
		case TouchBarItemType.ObsidianTouchBarButton:
			return {name: "Button", icon: "toggle-right"}
		case TouchBarItemType.ObsidianTouchBarColorPicker:
			return  {name: "Color Picker",icon: "paintbrush"}
		case TouchBarItemType.ObsidianTouchBarGroup:
			return {name: "Group",icon: "group"}
		case TouchBarItemType.ObsidianTouchBarLabel:
			return {name: "Label", icon: "tag"}
		case TouchBarItemType.ObsidianTouchBarPopover:
			return {name: "Popover",icon: "package-2"}
		case TouchBarItemType.ObsidianTouchBarScrubber:
			return {name: "Scrubber", icon: "gallery-horizontal"}
		case TouchBarItemType.ObsidianTouchBarSegmentedControl:
			return {name: "Segmented Control", icon: "sliders-horizontal"}
		case TouchBarItemType.ObsidianTouchBarSlider:
			return {name: "Slider", icon: "move-horizontal"}
		case TouchBarItemType.ObsidianTouchBarSpacer:
			return {name: "Spacer", icon: "separator-vertical"}
	}
}


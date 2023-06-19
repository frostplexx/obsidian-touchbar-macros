# Obsidian Mac Touchbar

This is a plugin for [Obsidian](https://obsidian.md/) that adds a touchbar to the Mac app.



## Features



## Installation

### From within Obsidian

From Obsidian v0.9.8, you can activate this plugin within Obsidian by doing the following:

- Open Settings > Third-party plugin
- Make sure Safe mode is **off**
- Click Browse community plugins
- Search for this plugin
- Click Install
- Once installed, close the community plugins window and activate the newly installed plugin
- See [here](https://forum.obsidian.md/t/plugins-mini-faq/7737) for more information on how to enable and configure plugins in Obsidian
- If you are still having trouble installing this plugin, feel free to open an issue [here]()
- If you successfully installed the plugin, please consider [sponsoring me]()

### From GitHub

- Download the Latest Release from the Releases section of the GitHub Repository
- Extract the plugin folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`
- Reload Obsidian
- If you are still having trouble installing this plugin, feel free to open an issue [here]()
- If you successfully installed the plugin, please consider [sponsoring me]()
- Note: This plugin requires Obsidian v0.9.8 or above to work properly.

## Usage

TODO


## Makro Language

For adding makros please use this syntax:

| Syntax    | Description                                                                                    |
|-----------|------------------------------------------------------------------------------------------------|
| [KEYCODE] | This is how you press a key, where `KEYCODE` is the name of the key you want pressed           |
| +         | + is used to combine multiple keys                                                             |
| ,DELAY,   | , is used to add a delay between key presses where `DELAY` is the amount in ms                 |
| "TEXT"    | " is used to add text where `TEXT` is the text you want to add. The plugin will type this text |
| #         | # is used to add a comment where `COMMENT` is the comment you want to add  (NOT IMPLEMENTED)   |
| \         | \ is used to escape the next character                                                        |
| ( )REPEAT | () is used to repeat the previous command where `REPEAT` is the amount of times to repeat      |

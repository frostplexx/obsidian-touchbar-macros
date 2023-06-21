# Obsidian Touch Bar Macros
This is a plugin for [Obsidian](https://obsidian.md/) that adds a touchbar to the Mac app.

## Features

- Add custom items to your touchbar
- Do anything faster with macros
- Perform your favorite actions with a single touch
- Customize the color of your touchbar items

## Screenshots

![Screenshot 2023-06-20 at 18 41 33](https://github.com/Frostplexx/obisdian-mac-touchbar/assets/62436912/59981b82-ff03-4bea-a763-1c69b8b48880)



https://github.com/Frostplexx/obisdian-mac-touchbar/assets/62436912/fe467348-ffcf-4ae3-87bd-ac01ae8c26c1




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
- If you are still having trouble installing this plugin, feel free to open an issue [here](https://github.com/Frostplexx/obisdian-mac-touchbar/issues)

### From GitHub

- Download the Latest Release from the Releases section of the GitHub Repository
- Extract the plugin folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`
- Reload Obsidian
- If you are still having trouble installing this plugin, feel free to open an issue [here](https://github.com/Frostplexx/obisdian-mac-touchbar/issues)
- Note: This plugin requires Obsidian v0.9.8 or above to work properly.

## Usage

1. Open the settings for the plugin
2. Add a new touchbar item
3. Add a name (can be any ascii character), a color and a macro
4. Close the settings page and enjoy your new touchbar item

### Macro Language

For adding macros please use this syntax:

| Syntax     | Description                                                                                    |
|------------|------------------------------------------------------------------------------------------------|
| [KEYCODE]  | This is how you press a key, where `KEYCODE` is the name of the key you want pressed           |
| +          | + is used to combine multiple keys                                                             |
| ,DELAY,    | , is used to add a delay between key presses where `DELAY` is the amount in ms                 |
| "TEXT"     | " is used to add text where `TEXT` is the text you want to add. The plugin will type this text |
| #          | # is used to add a comment where `COMMENT` is the comment you want to add  (NOT IMPLEMENTED)   |
| \          | \ is used to escape the next character                                                         |
| {REPEAT}() | {}() is used to repeat the previous command where `REPEAT` is the amount of times to repeat    |

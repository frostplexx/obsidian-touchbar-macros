
export class ObsidianTouchBarItem {
	label: string
	backgroundColor: string
	id: string
	macro: string

	constructor(label: string, backgroundColor: string,  macro: string) {
		this.label = label
		this.backgroundColor = backgroundColor
		this.id = this.generateId()
		this.macro = macro
	}

	getLabel(): string {
		return this.label || ""
	}

	getBackgroundColor(): string {
		return this.backgroundColor
	}


	getMacro(): string {
		return this.macro
	}

	setLabel(label: string) {
		this.label = label
	}

	setBackgroundColor(backgroundColor: string) {
		this.backgroundColor = backgroundColor
	}

	generateId(): string {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
	}

	getId(): string {
		return this.id
	}

}


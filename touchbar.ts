
export class ObsidianTouchBarItem {
	label: string
	backgroundColor: string
	id: string
	makro: string

	constructor(label: string, backgroundColor: string,  makro: string) {
		this.label = label
		this.backgroundColor = backgroundColor
		this.id = this.generateId()
		this.makro = makro
	}

	getLabel(): string {
		return this.label || ""
	}

	getBackgroundColor(): string {
		return this.backgroundColor
	}


	getMakro(): string {
		return this.makro
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


export default class Time extends EventTarget {
	start: number
	current: number
	elapsed: number
	delta: number
	active: boolean = true

	constructor() {
		super()

		this.start = Date.now()
		this.current = this.start
		this.elapsed = 0
		this.delta = 16

		requestAnimationFrame(() => this.tick())
	}

	tick() {
		if (!this.active) return

		const currentTime = Date.now()
		this.delta = currentTime - this.current
		this.current = currentTime
		this.elapsed = this.current - this.start

		this.dispatchEvent(new Event('tick'))
		requestAnimationFrame(() => this.tick())
	}

	destroy() {
		this.active = false
	}
}

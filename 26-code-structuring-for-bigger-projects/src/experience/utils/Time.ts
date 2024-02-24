export default class Time extends EventTarget {
	start: number
	current: number
	elapsed: number
	delta: number
	constructor() {
		super()

		console.log('time initted innit')

		this.start = Date.now()
		this.current = this.start
		this.elapsed = 0
		this.delta = 16

		requestAnimationFrame(() => this.tick())
	}

	tick() {
		// console.log('tick')
		const currentTime = Date.now()
		this.delta = currentTime - this.current
		this.current = currentTime
		this.elapsed = this.current - this.start

		this.dispatchEvent(new Event('tick'))

		requestAnimationFrame(() => this.tick())
	}
}

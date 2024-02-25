export default class Sizes extends EventTarget {
	width: number
	height: number
	pixelRatio: number

	constructor() {
		super()
		this.width = window.innerWidth
		this.height = window.innerHeight
		this.pixelRatio = Math.min(window.devicePixelRatio, 2)

		window.addEventListener('resize', this.handleResize)
	}

	handleResize = () => {
		this.width = window.innerWidth
		this.height = window.innerHeight
		this.pixelRatio = Math.min(window.devicePixelRatio, 2)

		this.dispatchEvent(new Event('resize'))
	}

	destroy() {
		window.removeEventListener('resize', this.handleResize)
	}
}

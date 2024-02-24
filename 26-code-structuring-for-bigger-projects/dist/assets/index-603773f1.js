;(function () {
	const o = document.createElement('link').relList
	if (o && o.supports && o.supports('modulepreload')) return
	for (const e of document.querySelectorAll('link[rel="modulepreload"]')) n(e)
	new MutationObserver((e) => {
		for (const t of e)
			if (t.type === 'childList')
				for (const r of t.addedNodes)
					r.tagName === 'LINK' && r.rel === 'modulepreload' && n(r)
	}).observe(document, { childList: !0, subtree: !0 })
	function c(e) {
		const t = {}
		return (
			e.integrity && (t.integrity = e.integrity),
			e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
			e.crossOrigin === 'use-credentials'
				? (t.credentials = 'include')
				: e.crossOrigin === 'anonymous'
				? (t.credentials = 'omit')
				: (t.credentials = 'same-origin'),
			t
		)
	}
	function n(e) {
		if (e.ep) return
		e.ep = !0
		const t = c(e)
		fetch(e.href, t)
	}
})()
class s {
	constructor(o) {
		;(this.name = o), console.log('I exist')
	}
	sayHi() {
		console.log(`Hi I am ${this.name}`)
	}
}
const l = new s('Wall-E')
new s('Ultron')
new s('Astro Boy')
l.sayHi()
//# sourceMappingURL=index-603773f1.js.map

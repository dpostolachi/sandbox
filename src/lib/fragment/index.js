export default () => {
	( ( existingElem ) => {
		return (elem, props = {}, content = []) => {
			if (!existingElem) {
				existingElem = document.createElement(elem)
			}
			Object.entries(props)
				.forEach(([key, value]) => {
					const oldValue = existingElem[key] || undefined
					if (oldValue !== value)
						existingElem[key] = value
					return
				})
			if (!Array.isArray(content))
				content = [content]

			const childs = existingElem.childNodes || []

			content.forEach((v, k) => {
				const isFirst = k == 0
				const target = childs[k]
				switch (target) {
					case undefined:
						if (v instanceof Element) {
							if (isFirst) {
								existingElem.appendChild(v)
							} else {
								console.log('here', childs[k - 1])
								if (target) {
									existingElem.insertBefore(target, v)
								} else {
									existingElem.appendChild(v)
								}
							}
						} else {
							const newTextNode = document.createTextNode(v)
							if (isFirst)
								return existingElem.appendChild(newTextNode)
							else
								existingElem.insertBefore(childs[k - 1], newTextNode)
						}
						break
					default:
						switch (target.nodeType) {
							case Node.TEXT_NODE:
								if (target.textContent !== v)
									target.textContent = v
								return target
								break
							case Node.ELEMENT_NODE:
								if (!target.isEqualNode(v)) {
									existingElem.insertBefore(target, v)
									existingElem.removeChild(target)
								}
								break;
						}
						break
				}
			})
			return existingElem
		}
	} )( null )
}

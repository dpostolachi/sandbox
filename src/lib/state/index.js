const makeHandler = ( initialObject = undefined ) => ( {
	get: ( target, property ) => {

		if ( typeof target[ property ] === 'object' && target[ property ] !== null ) {

			return new Proxy( target[ property ], makeHandler( target[ property ], target ) )

		} else {

			if ( typeof target[ property ] === 'function' ) {
				// Array modifiers

				if ( [ 'push', 'unshift', 'pop', 'splice' ].includes( property ) ){

					return function ( ...args ) {

						const val = Array.prototype[ property ].apply(target, args )

						subscribers.forEach( ( {
							__fn
						} ) => __fn( initialObject || target ) )

						return val

					}

				}

			}

			return target[ property ]

		}

	},
	set: ( target, prop, value ) => {
		target[ prop ] = value
		subscribers.forEach( ( {
			__fn
		}) => __fn( initialObject || target ) )
	}
} )

export default ( initialState ) => {

    return ( ( __subscribers ) => {

		const handler = ( initialObject = undefined ) => ( {
			get: ( target, property ) => {

				// Handling objects
				if ( typeof target[ property ] === 'object' ) {

					return new Proxy( target[ property ], handler( target ) )

				} else {

					if ( typeof target[ property ] === 'function' ) {
						// Array modifiers

						if ( [ 'push', 'unshift', 'pop', 'splice' ].includes( property ) ){

							return function ( ...args ) {

								const val = Array.prototype[ property ].apply(target, args )

								__subscribers.forEach( ( {
									__fn
								} ) => __fn( initialObject.__state || target.__state ) )

								return val

							}

						}

					}

					return target[ property ]

				}

			},
			set: ( target, prop, value ) => {

				const oldValue = target[ prop ]
				if ( oldValue !== value ) {
					target[ prop ] = value
					__subscribers.forEach( ( {
						__fn
					}) => __fn( initialObject || target ) )
				}

				return true

			}

		} )

		return new Proxy( {
			...initialState,
			__observable: true,
			__subscribe: __fn => __subscribers.push( { __fn } ),
		}, handler() )
		// return proxied

    } )( [] )

}

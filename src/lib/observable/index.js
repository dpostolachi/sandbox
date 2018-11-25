import createState from '../state'

export default ( state, mapper = null ) => {
	return ( fn ) => {
		if ( mapper ) {
			const newState = createState( mapper( state ) )
			newState.__subscribe( fn )
			state.__subscribe( store => {
				Object.assign( newState, mapper( state ) )
			} )
			return fn( mapper( state ) )
		} else {
			state.__subscribe( fn )
			return fn( state )
		}
	}
}

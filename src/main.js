import createState from './lib/state'
import observable from './lib/observable'

const State = createState( {
	counter: {
		value: 0,
	},
	other: {
		value: 0,
	}
} )

const Counter = document.createElement( 'span' )

observable( State, ( { counter: { value } } ) => {
	return { value }
} )( ( { value } ) => {
	console.log( 'wham' )
	Counter.innerText = value
} )

setInterval( () => {
	State.counter.value += 1
}, 1000)

setInterval( () => {
	State.other.value += 1
}, 500)

const AppContainer = document.getElementById( 'app' )
AppContainer.appendChild( Counter )

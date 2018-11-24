const FragmentContainer = {
	new: () => {
		let existingElem = null
		return ( elem, props = {}, content = [] ) => {
			if ( !existingElem ){
				existingElem = document.createElement( elem )
			}
			Object.entries( props )
			.forEach( ( [ key, value ] ) => {
        const oldValue = existingElem[ key ] || undefined
        if ( oldValue !== value )
				  existingElem[ key ] = value
        return
			} )
      if ( !Array.isArray( content ) )
          content = [ content ]

      const childs = existingElem.childNodes || []
      
      content.forEach( ( v, k ) => {
        const isFirst = k == 0
        const target = childs[ k ]
        switch( target ){
          case undefined:
            if ( v instanceof Element ) {
              if ( isFirst ) {
                existingElem.appendChild( v )
              } else {
                console.log( 'here', childs[ k - 1 ] ) 
                if ( target ){
                  existingElem.insertBefore( target, v ) 
                } else {
                  existingElem.appendChild( v )
                }
              }
            } else {
              const newTextNode = document.createTextNode( v )
              if ( isFirst )
                  return existingElem.appendChild( newTextNode )
              else
                existingElem.insertBefore( childs[ k - 1 ], newTextNode ) 
            }
          break
          default:
            switch( target.nodeType ) {
              case Node.TEXT_NODE:
                if ( target.textContent !== v )
                  target.textContent = v
                return target
              break
              case Node.ELEMENT_NODE:
                if ( !target.isEqualNode( v ) ){
                  existingElem.insertBefore( target, v )
                  existingElem.removeChild( target )
                }
              break;
            }
          break
        }
      } )
			return existingElem
		}
	}
}


const createState = ( initialState ) => {
	return ( ( subscribers ) => {
		return new Proxy( {
			...initialState,
			subscribers,
			subscribe: ( fragment, __fn ) => subscribers.push( { fragment, __fn } ),
		}, {
			get: ( target, property ) => target[ property ],
			set: ( target, prop, value ) => {
			  target[ prop ] = value
			  subscribers.forEach( ( { fragment, __fn } ) => __fn( fragment, target ) )
		  	}
		} )
	} )( [] )
}

const observable = ( state ) => {
	return ( changeset ) => {

		const fragment = FragmentContainer.new()
		state.subscribe( fragment, changeset )
		return changeset( fragment, state )
	}
}

const State = createState( {
	title: 'hello',
  list: [
    'a item'
  ],
} )

const myTitle =  observable( State )( ( createFragment, { title } ) => {
	return createFragment( 'h1', {}, title )
} )

const HandleInput = ( e ) => {
  State.title = e.currentTarget.value
}

const myInput =  observable( State )( ( createFragment, { title } ) => {
	return createFragment( 'input', {
		onkeyup: HandleInput,
    type: 'text',
	} )
} )

const myList =  observable( State )( ( createFragment, { list } ) => {
	return createFragment( 'ul', {
	}, list.map( ( v, key ) => {
    const elem = document.createElement( 'li' )
    elem.innerText = v
    return elem
  } ) )
} )

const handleButton = ( e ) => {
  const { list } = State
  list.push( 'item ' + list.length )
  State.list = list
}

const myButton = observable( State )( ( createFragment, _ ) => {
  return createFragment( 'button', {
    onclick: handleButton,
  }, 'add item' )
} )

const Container = observable( State )( ( createFragment, _ ) => {
  return createFragment( 'div', {}, [
    myTitle,
    myInput,
    myList,
    myButton,
  ] )
} )

document.getElementById( 'app' )
.appendChild( Container )

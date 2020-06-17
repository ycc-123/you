/**
 * file 导购
 */

const guide = (state={}, action) => {
	switch(action.type) {
		case 'ADD_GUIDE': 
			return {...action}
		case 'CLEAR_GUIDE':
			return {}
		default: 
			return state
	}
}

export default guide
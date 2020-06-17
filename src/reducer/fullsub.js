/**
 * file  满减
 */

const fullsub = (state={}, action) => {
	switch(action.type) {
		case 'GET_FULLSUB':
			return {...action}
		default:
			return {...state}
	}
}


export default fullsub
/**
 * file 收银员
 */

const sale = (state={} , action) => {
	switch(action.type) {
		case 'GET_SALE':
			return {...action}
		default: 
			return {...state}
	}
}

export default sale
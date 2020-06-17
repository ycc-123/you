/**
 * file 库存商品
 */

const stockgoods = (state = {}, action) => {
	switch(action.type) {
		case 'GET_STOCKGOODS': 
			if(action.data&&action.data.page !== 1) {
		    	state.data.data = state.data.data.concat(action.data.data)
		    	state.data.page = action.data.page
		    	return {...state}
		    } else {
		    	return {...action}
		    }
		case 'CHANGEPAGE_STOCKGOODS': 
			state.data.page = action.page
			return {...state}
        case 'GET_GOODS':
            if(action.status != 'error'){
                state.data = action.data
                state.data.data = action.data.msg
                state.data.page = action.data.page
                return {...state}
             }
		default:
			return state
	}
}

export default stockgoods
/**
 * file 分类
 */


const category = (state= {}, action) => {
	switch (action.type) {
		case 'GET_CATEGORY':
			return {...action}
		default:
			return state 
	}
}

export default category
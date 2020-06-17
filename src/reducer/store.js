/**
 * file 门店信息
 */

const store = (state={}, action) => {
	switch(action.type) {
		case 'GET_STORE':
			// `total_accuracy` tinyint(3) NOT NULL DEFAULT '1' COMMENT '总价精度：1:分，2:角，3：元',
 			// `total_set` tinyint(3) NOT NULL DEFAULT '1' COMMENT '总价精度设置：1:四舍五入，2:直接抹掉尾数',
 			/**
 			 * [修改total_accuracy的值，对应到 Number.toFixed(value) ]
 			 */
			action.data.total_accuracy = action.data.total_accuracy === 1 ? 2 : (action.data.total_accuracy === 2 ? 1 : 0) 
			return {...action}
		case 'EIDT_STORE': 
			return {...action}
		default:
			return {...state}
	}
}

export default store
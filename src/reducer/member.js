/**
 * 
 * file 会员信息
 */

/**
 * 
 * file 会员信息
 */

const KEY = '__member'
const LOCAL = getLocalStorage()

// 获取本地存锤
function getLocalStorage (key = KEY) {
  const str = localStorage.getItem(key)
  return str ? JSON.parse(str) : {type: 'INIT'}
}

// 存储到本地
function setLocalStorage (value, key = KEY) {
  localStorage.setItem(key, JSON.stringify(value))
}

const member = (state={...LOCAL}, action) => {
	let result
	switch(action.type) {	
		case 'GET_MEMBER': 
			result = {...action}
			break
		case 'REPLACE_MEMBER':
			result = {...action}
			break
		case 'UPDATE_FROM_MEMBER':
			result = {type: action.type, data: {...state.data, rights: action.rights}}
			break
		case 'CLEARMEMBER':
			result = {}
			break
		default:
			result = state
			break
	}
	if (setLocalStorage.timer) clearTimeout(setLocalStorage.timer)
	setLocalStorage.timer = setTimeout(() => {
		setLocalStorage(result) // 更新本地存储
	}, 500)
	return result
}

export default member
/**
 * 权限管理
 */

const authority =(state={type: ''}, action)=>{
    switch (action.type) {
        case 'ADD_AUTHORITY':
            return {...state,...action}
        case 'DELETE_AUTHORITY':
            return {...action}
        default:
            return state
    }
}

export default authority
import {combineReducers} from 'redux'
import * as type from '../action/type'
import category from './category'
import goods from './goods'
import order from './order'
import member from './member'
import fullsub from './fullsub'
import store from './store'
import sale from './sale'
import authority from './authority'
import setting from './setting'
import priceadjustment from './priceadjustment'
import reportdamage from './reportdamage'
import purchase from './purchase'
import fundTransfer from './fundTransfer'
import stockgoods from './stockgoods'
import guide from './guide'
import soldout from './Soldout'
import putaway from './putaway'
import status from './status'
import leaflet from './leaflet'

const handleData = (state = {isFetching: true, data: {}}, action) => {
  switch (action.type) {
    case type.REQUEST_DATA:
      return {...state, isFetching: true};
    case type.RECEIVE_DATA:
      return {...state, isFetching: false, data: action.data};
    default:
      return {...state}
  }
}

const httpData = (state = {}, action) => {
  switch (action.type) {
    case type.RECEIVE_DATA:
    case type.REQUEST_DATA:
      return {
        ...state,
        [action.category]: handleData(state[action.category], action)
      }
    default:
      return {...state}
  }
}


export default combineReducers({
  authority,
  httpData,
  category,
  goods,
  order,
  member,
  fullsub,
  store,
  sale,
  setting,
  priceadjustment,
  reportdamage,
  fundTransfer,
  stockgoods,
  purchase,
  guide,
  soldout,
  putaway,
  status,
  leaflet,
})

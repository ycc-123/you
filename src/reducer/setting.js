/**
 * file 设置
 */

const KEY = '__setting'
const LOCAL = getLocalStorage()

// 获取本地存锤
function getLocalStorage(key = KEY) {
  const str = localStorage.getItem(key)
  if (str == null || !str) {
    var strr = {
      fontSize: 8,
      layout: 'style1',
      showStock: false,
      categoryColor: ['#ffffff', '#ffffff', '#ffffff'],
      paytypeBackground: ['#ffffff', '#ffffff', '#ffffff'],
      goodbackground: ['#ffffff', '#ffffff', '#ffffff'],
      width: 150,
      goodweight: '0.00',
      isblod: false,
      teashop: false,
      isweight: false,
      search: '',
      xj1126: false,
      searchtype: 1,
      isshowgimg: true,
      columnNum: 2,
      rowsnum: 16,
      hasnum: false,
      isbig: false,
      payType: [true, true, true, true, true, true, true, true, false],
      payNum: -1,
      sw_orderNumber: false,
      thejoiningtogetheroftwoyards: false,
      is_tabulate: false,
      Inventory: false,
      Voice: true,
      remove: false,
      orderby: false,
      isFissionScale: false,
      a: 0,
    }
    return strr
  } else {
    var strr = JSON.parse(str)
    strr['search'] = '';
    strr['searchtype'] = 1;
    if (!JSON.parse(str).paytypeBackground) {
      strr['paytypeBackground'] = ['#ffffff', '#ffffff', '#ffffff'];
    }
    if (JSON.parse(str).isFissionScale == undefined) {
      strr['isFissionScale'] = false;
    }
    if (JSON.parse(str).isweight == undefined) {
      strr['isweight'] = false;
    }
    if (JSON.parse(str).a == undefined) {
      strr['a'] = 0;
    }
    if (JSON.parse(str).xj1126 == undefined) {
      strr['xj1126'] = false;
    }
    if (JSON.parse(str).orderby == undefined) {
      strr['orderby'] = false;
    }
    if (JSON.parse(str).remove == undefined) {
      strr['remove'] = false;
    }
    if (JSON.parse(str).Voice == undefined) {
      strr['Voice'] = true;
    }
    if (JSON.parse(str).Inventory == undefined) {
      strr['Inventory'] = false;
    }
    if (JSON.parse(str).isbig == undefined) {
      strr['isbig'] = false;
    }
    if (JSON.parse(str).thejoiningtogetheroftwoyards == undefined) {
      strr['thejoiningtogetheroftwoyards'] = false;
    }
    if (JSON.parse(str).hasnum == undefined) {
      strr['hasnum'] = false;
    }
    if (JSON.parse(str).sw_orderNumber == undefined) {
      strr['sw_orderNumber'] = false;
    }
    if (JSON.parse(str).is_tabulate == undefined) {
      strr['is_tabulate'] = false;
    }
    if (JSON.parse(str).isshowgimg == undefined) {
      strr['isshowgimg'] = true;
    }
    if (JSON.parse(str).payType == undefined) {
      strr['payType'] = [true, true, true, true, true, true, true, true];
    }

    if (JSON.parse(str).columnNum == undefined) {
      strr['columnNum'] = 2;
    }
    if (JSON.parse(str).rowsnum == undefined) {
      strr['rowsnum'] = 16;
    }
    if (!JSON.parse(str).goodbackground) {
      strr['goodbackground'] = ['#ffffff', '#ffffff', '#ffffff'];
    }
    if (!JSON.parse(str).width) {
      strr['width'] = '150';
    }
    if (!JSON.parse(str).goodweight) {
      strr['goodweight'] = '0.00';
    }
    if (JSON.parse(str).isblod == undefined) {
      strr['isblod'] = false;
    }
    if (JSON.parse(str).teashop == undefined) {
      strr['teashop'] = false;
    }
    if (JSON.parse(str).payNum == undefined) {
      strr['payNum'] = -1;
    }
    return strr
  }

}

// 存储到本地
function setLocalStorage(value, key = KEY) {
  localStorage.setItem(key, JSON.stringify(value))
}

const setting = (state = { ...LOCAL }, action) => {
  let result
  switch (action.type) {
    case 'CHANGE_SETTING':
      result = { ...action }
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

export default setting
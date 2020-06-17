import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import './style/lib/animate.css'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose} from 'redux'
import reducer from './reducer'
import { AppContainer } from 'react-hot-loader'
import router from './router'

const reduxDevtools = window.devToolsExtension
    ? window.devToolsExtension()
    : f => f;

// redux 注入操作
const middleware = [thunk];
const store = createStore(reducer, compose(applyMiddleware(...middleware), reduxDevtools));
// console.log(store.getState());

const render = Component => {
	ReactDOM.render(
		<AppContainer>
			 <Provider store={store}>
                <LocaleProvider locale={zhCN}>
                    <Component store={store} />
                </LocaleProvider>
            </Provider>
		</AppContainer>
		,
        document.getElementById('root')
	);
}

render(router);

// Webpack Hot Module Replacement API
if (module.hot) {
    // 隐藏You cannot change <Router routes>; it will be ignored 错误提示
    // react-hot-loader 使用在react-router 3.x上引起的提示，react-router 4.x不存在
    // 详情可参照https://github.com/gaearon/react-hot-loader/issues/298
    const orgError = console.error; // eslint-disable-line no-console
    console.error = (...args) => { // eslint-disable-line no-console
        if (args && args.length === 1 && typeof args[0] === 'string' && args[0].indexOf('You cannot change <Router routes>;') > -1) {
            // React route changed
        } else {
            // Log the error as normally
            orgError.apply(console, args);
        }
    };
    module.hot.accept('./router', () => {
        render(router);
    })
}

// ReactDOM.render(
//     <AppContainer>
//         <Provider store={store}>
//             <CRouter store={store} />
//         </Provider>
//     </AppContainer>
//  ,
//   document.getElementById('root')
// );
// registerServiceWorker();

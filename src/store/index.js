import { combineReducers,createStore } from 'redux'
import chatHandler from '../module/chat/chatContainer/chatData'

const reducers=combineReducers({
    chatContainer:chatHandler
})

export default createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
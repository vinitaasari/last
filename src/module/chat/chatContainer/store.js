import { combineReducers,createStore } from 'redux'
import chatContainer from './chatData'

const reducers=combineReducers({
    chatContainer:chatContainer
})

export default createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
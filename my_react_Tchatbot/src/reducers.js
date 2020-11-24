import { combineReducers } from 'redux'

import bot from './components/bot/reducer'
import message from './components/message/reducer'

const reducers = {
  bot,
  message
}

export default combineReducers(reducers)

import { actionBot } from './actions'

const initialState = [{
    id: '111',
    name: 'Youtube',
    fname: 'YT',
    checked: true,
    group: 'youtube',
}, {
    id: '222',
    name: 'Weather',
    fname: "WT" ,
    checked: false,
    group: 'meteo',
}, {
    id: '333',
    name: 'Imdb',
    fname: "I",
    checked: false,
    group: 'imdb'
}]

/**
 * Task bot.checkd
 * @param {object} state
 * @param {object} action
 * @return {object} state
 */
const task = (state, action) => {
    const { id } = action
  
    return state.map(item => {
      if (item.id === id) {
        item.checked = true
      }else{
        item.checked = false
      }
      return item
    })
  }

/* store */
export default (state = initialState, action) => {
    switch (action.type) {
      case actionBot.TASK_BOT:
        return task(state, action)
      default:
        return state
    }
  }
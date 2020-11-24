import { actionMessage } from './actions'

const initialState = []

/**
 * Task message checked
 * @param {object} state
 * @param {object} action
 * @return {object} state
 */

const setMessage = (state, action) => {
  const { group, content } = action
  return state.concat({ group: group, content: content });
}

/* store */
export default (state = initialState, action) => {
    switch (action.type) {
      case actionMessage.TASK_SEND_MESSAGE:
        return setMessage(state, action)
      default:
        return state
    }
  }
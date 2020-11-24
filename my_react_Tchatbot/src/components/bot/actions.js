export const actionBot = {
    TASK_BOT: 'TASK_BOT'
}

/**
 * Task CHAT / Response
 * @return {object} action
 */
export const taskBot = id => ({
    type: actionBot.TASK_BOT,
    id
})

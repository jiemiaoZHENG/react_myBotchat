export const actionMessage = {
    TASK_SEND_MESSAGE: 'TASK_SEND_MESSAGE'
}

/**
 * Task message / Response
 * @return {object} action
 */
export const taskMessage = (group, content) => ({
    type: actionMessage.TASK_SEND_MESSAGE,
    group,
    content
})
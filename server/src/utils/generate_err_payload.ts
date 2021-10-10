

export const generateErrorPayload = (err: Error) => {
    console.log({
        error: true,
        message: err.message
    })
    return {
        error: true,
        message: err.message
    }
}
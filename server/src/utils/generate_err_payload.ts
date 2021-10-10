

export const generateErrorPayload = (err: Error) => {
    return {
        error: true,
        message: err.message
    }
}
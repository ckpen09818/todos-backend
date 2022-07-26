import { StatusCodes } from 'http-status-codes'
import { type Response } from 'express'

type ResponseMessage<T = null> = {
    code: StatusCodes
    success: boolean
    message: string
    data?: T
}

export const serverResponse = {
    sendSuccess: <T = null>(res: Response, message: Omit<ResponseMessage, 'data'>, data?: T) => {
        const responseMessage: ResponseMessage<T> = {
            code: message.code,
            success: message.success,
            message: message.message,
        }

        if (data) {
            responseMessage.data = data
        }

        res.status(responseMessage.code).json(responseMessage)
    },
    sendError: (res: Response, error) => {
        const responseMessage = {
            code: error.code ? error.code : 500,
            success: false,
            message: error.message,
        }
        res.status(responseMessage.code).json(responseMessage)
    },
}

import dayjs from 'dayjs'
import { type RequestHandler } from 'express'

import TaskCollection from '@/modules/Task'
import messages from '@/configs/messages'
import { isNullOrUndefined, serverResponse } from '@/utils'

type RequestBody = {
    isFinish?: boolean
    text: string
    note?: string
    date?: string
}
export const createTask: RequestHandler<unknown, unknown, RequestBody> = async (req, res) => {
    const { isFinish = false, text, note = '', date = new Date() } = req.body

    try {
        const newTask = await TaskCollection.create({
            isFinish,
            text,
            note,
            date,
        })

        serverResponse.sendSuccess(res, messages.SUCCESSFUL, newTask.toObject())
    } catch (err) {
        serverResponse.sendError(res, messages.BAD_REQUEST)
    }
}

type GetTasksRequestBody = {
    important?: boolean
    isFinish?: boolean
    date?: Date | string
}

export const getTasks: RequestHandler<unknown, unknown, GetTasksRequestBody> = async (req, res) => {
    const { important, isFinish, date = new Date() } = req.query

    const startOfDate = dayjs(date as Date | string)
        .startOf('d')
        .toDate()
        .toUTCString()
    const endOfDate = dayjs(date as Date | string)
        .endOf('d')
        .toDate()
        .toUTCString()

    const query = {
        date: { $gte: startOfDate, $lte: endOfDate },
    }

    try {
        const tasks = await TaskCollection.find(query)

        const responseData = tasks.map((task) => task.toObject())

        serverResponse.sendSuccess(res, messages.SUCCESSFUL, responseData)
    } catch (err) {
        serverResponse.sendError(res, messages.BAD_REQUEST)
    }
}

type UpdateTaskRequest = {
    tid: string
    isFinish?: boolean
    important?: boolean
    text?: string
    note?: string
}
export const updateTaskState: RequestHandler<unknown, unknown, UpdateTaskRequest> = async (req, res) => {
    const { tid, isFinish, important, text, note } = req.body

    const updateData = Object.entries({ isFinish, important, text, note }).reduce((obj, [key, val]) => {
        if (!isNullOrUndefined(val)) obj[key] = val
        return obj
    }, {} as Omit<UpdateTaskRequest, 'tid'>)

    try {
        const updatedTask = await TaskCollection.findOneAndUpdate(
            { _id: tid },
            { $set: updateData },
            { new: true },
        ).exec()
        serverResponse.sendSuccess(res, messages.SUCCESSFUL_UPDATE, updatedTask.toObject())
    } catch (err) {
        serverResponse.sendError(res, messages.BAD_REQUEST)
    }
}

type DeleteTaskRequest = {
    tid: string
}
export const deleteTask: RequestHandler<unknown, unknown, DeleteTaskRequest> = async (req, res) => {
    const { tid } = req.body

    try {
        await TaskCollection.deleteOne({ _id: tid }).exec()

        serverResponse.sendSuccess(res, messages.SUCCESSFUL_DELETE)
    } catch (err) {
        serverResponse.sendError(res, messages.BAD_REQUEST)
    }
}

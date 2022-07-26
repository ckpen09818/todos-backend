import mongoose, { Schema } from 'mongoose'

interface Task {
    isFinish: boolean
    text: string
    note: string
    important: boolean
    date: Date
}

const REMOVE_PROPERTIES = '_id createdAt updatedAt __v'
const TaskSchema = new Schema<Task>(
    {
        text: { type: String, required: true },
        note: { type: String, required: false, default: '' },
        date: { type: Date, required: true },
        important: {
            type: Boolean,
            default: false,
        },
        isFinish: {
            type: Boolean,
            default: false,
        },
    },
    {
        autoCreate: true,
        timestamps: true,
        toObject: {
            transform: function (doc, ret) {
                ret.tid = ret._id
                REMOVE_PROPERTIES.split(' ').forEach((key) => {
                    delete ret[key]
                })
                return ret
            },
        },
    },
)

const TaskCollection = mongoose.model('Task', TaskSchema)

export default TaskCollection

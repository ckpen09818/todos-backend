import { Router } from 'express'

import { getTasks, createTask, updateTaskState, deleteTask } from '@/controllers/task'

const router = Router()

router.get('/', getTasks)
router.post('/', createTask)
router.patch('/', updateTaskState)
router.delete('/', deleteTask)

export default router

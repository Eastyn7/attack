import { Router } from 'express'
import { callAiApi } from '../controllers/aiController'

const router = Router()

// 调用接口
router.post('/callaiapi', callAiApi)

export default router

import { Router } from 'express'
import { analyzeData } from '../controllers/analyseController'

const router = Router()

// 调用分析的接口
router.post('/analysedata', analyzeData)

export default router

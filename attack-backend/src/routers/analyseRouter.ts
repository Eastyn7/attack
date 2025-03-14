import { Router } from 'express'
import { analyzeData, getResultHistory } from '../controllers/analyseController'

const router = Router()

// 调用分析的接口
router.post('/analysedata', analyzeData)

// 获取历史记录的接口
router.post('/gethistory', getResultHistory)

export default router

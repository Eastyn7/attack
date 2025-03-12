import { Router } from 'express'
import publicRoutes from './publicRouter'
import userRoutes from './userRouter'
import dataListRoutes from './dataListRouter'
import projectListRoutes from './projectListRouter'
import auditInfoListRoutes from './auditInfoRouter'
import aiRouter from './aiRouter'
import modelRoutes from './modelRouter'
import analyseRoutes from './analyseRouter'

const router = Router()

router.use('/public', publicRoutes) // 开放API
router.use('/user', userRoutes) // 用户相关的API
router.use('/datalist', dataListRoutes) // 数据表相关的API
router.use('/projectlist', projectListRoutes) // 项目表相关的API
router.use('/audit', auditInfoListRoutes) // 审计方法相关的API
router.use('/ai', aiRouter) // ai相关的API
router.use('/model', modelRoutes) // 模型相关的API
router.use('/analyse', analyseRoutes) // 模型相关的API

export default router;
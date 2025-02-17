import { Router } from 'express'
import publicRoutes from './publicRouter'
import userRoutes from './userRouter'
import dataListRoutes from './dataListRouter'

const router = Router()

router.use('/public', publicRoutes) // 开放API
router.use('/user', userRoutes) // 用户相关的API
router.use('/datalist', dataListRoutes) // 数据表相关的API

export default router;
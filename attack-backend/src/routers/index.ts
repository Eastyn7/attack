import { Router } from 'express'
import publicRoutes from './publicRouter'
// import userRoutes from './userRouter'

const router = Router()

router.use('/public', publicRoutes) // 开放API
// router.use('/user', userRoutes) // 用户相关的API

export default router;
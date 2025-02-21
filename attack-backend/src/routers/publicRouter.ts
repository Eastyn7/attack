import { Router } from 'express'
import { registerUser, loginUser } from '../controllers/userController'
import { getAuditInfoList } from '../controllers/auditController'
import { validateRegistration, validateLogin } from '../middlewares/validateInput'

const router = Router()

// 注册路由
router.post('/register', validateRegistration, registerUser)

// 登录路由
router.post('/login', validateLogin, loginUser)

// 获取审计方法列表
router.get('/getauditinfolist', getAuditInfoList)

export default router

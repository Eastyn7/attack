import { Router } from 'express'
import { createAuditInfo } from '../controllers/auditController'

const router = Router()

// 上传审计方法
router.post('/createauditinfo', createAuditInfo)

export default router

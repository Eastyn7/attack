import { Router } from 'express'
import { createProjectList, getProjectList } from '../controllers/projectController'

const router = Router()

// 上传项目
router.post('/createprojectlist', createProjectList)

// 获取用户项目列表
router.post('/getprojectlist', getProjectList)

export default router

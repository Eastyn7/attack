import { Router } from 'express'
import { createDataList, getDataList, getFilePath } from '../controllers/dataController'
// import { upload } from '../app'
import multer from 'multer'
// 配置 multer 使用内存存储
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router()

// 上传数据
router.post('/createdatalist', upload.single('data_file'), createDataList)

// 获取用户数据列表
router.post('/getdatalist', getDataList)

// 获取对应数据表链接地址
router.post('/getfilepath', getFilePath)

export default router

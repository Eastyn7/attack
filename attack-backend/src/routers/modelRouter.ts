import { Router } from 'express'
import { uploadModelFile} from '../controllers/modelController'
import multer from 'multer'
// 配置 multer 使用内存存储
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router()

// 上传数据
router.post('/uploadmodelfile', upload.single('model_file'), uploadModelFile)

export default router

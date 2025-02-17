import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { authenticateToken } from './middlewares/authenticationMiddleware';
import router from './routers/index';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 全局使用 tokenMiddleware，它会自动跳过不需要验证的路由
app.use(authenticateToken);

// 路由
app.use('/api', router);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(3309, () => {
  console.log('API server running at http://127.0.0.1:3309');
});

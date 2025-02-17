import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const UNPROTECTED_PATH_REGEX = /^\/api\/public|^\/api\/datalist\/createdatalist/; // 匹配所有以 /api/public 开头的路径

// 中间件：验证 JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  // 使用正则表达式检查路径是否需要跳过验证
  if (UNPROTECTED_PATH_REGEX.test(req.path)) {
    return next(); // 如果路径不需要验证，直接跳过中间件
  }

  const authHeader = req.headers['authorization']; // 从请求头中获取 Authorization
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token 格式

  if (!token) {
    return res.status(401).json({ message: '没有提供 token，访问被拒绝' });
  }

  // 验证 token 并解析
  jwt.verify(token, 'ATTACK', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'token 无效' });
    }

    // 将解码后的用户信息存入 request 对象中
    req.body.user = user;

    // 获取用户请求体中的 user_id
    const { user_id: requestAuthId } = req.body;
    const { user_id: analysisId } = req.body.user;

    // 比较解码出的 user_id 与请求中的 user_id 是否一致
    if (analysisId !== requestAuthId) {
      return res.status(403).json({ message: 'user_id 与 token 不匹配' });
    }

    next(); // 如果验证通过，继续执行下一个中间件或路由处理
  });
};

export const authenticateUser = (user_id: number, token: string): any => {
  // 验证 token 并解析
  jwt.verify(token, 'ATTACK', (err, user) => {
    if (err) {
      throw new Error('token 无效');
    }

    const requestAuthId = user_id;
    let analysisId: number;

    if (user && typeof user === 'object' && 'user_id' in user) {
      analysisId = user.user_id;
    } else {
      throw new Error('token 中不包含有效的 user_id');
    }

    if (analysisId !== requestAuthId) {
      throw new Error('user_id 与 token 不匹配');
    }

    return true; // 如果验证通过，返回 true
  });
};
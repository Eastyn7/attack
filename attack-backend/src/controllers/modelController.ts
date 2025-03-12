import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as modelService from '../services/modelService'
import { authenticateUser } from '../middlewares/authenticationMiddleware'

// 上传模型
export const uploadModelFile = async (req: Request, res: Response): Promise<void> => {
  const { user_id, model_name, file_type } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // 从请求头中获取 token

  if (!token) {
    errorResponse(res, "没有提供 token，访问被拒绝", 401);
    return
  }

  try {
    // 这里调用身份验证的方法
    await authenticateUser(Number(user_id), token); // 确保用户身份验证通过

    const model_file = req.file?.buffer; // 从 req.file 中获取文件的 buffer
    if (!model_file) {
      errorResponse(res, '未上传文件', 400);
      return;
    }

    // 调用服务层的上传模型逻辑
    const newModel = await modelService.uploadModelFile(Number(user_id), model_name, file_type, model_file);
    successResponse(res, newModel, '模型上传成功', 201);
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
    } else {
      errorResponse(res, "服务器内部错误", 500);
    }
  }
};
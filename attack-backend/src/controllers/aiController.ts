import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as aiService from '../services/aiService'

// 请求AI
export const callAiApi = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body;
  if (!content) {
    errorResponse(res, "缺少参数", 400);
  }
  try {
    // 调用服务层的创建审计方法逻辑
    const aiResult = await aiService.callAiApi(content);
    successResponse(res, { aiResult }, '请求成功', 201);
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
    } else {
      errorResponse(res, "服务器内部错误", 500);
    }
  }
};

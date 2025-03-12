import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as analyseService from '../services/analyseService';


// 调用Python分析项目
export const analyzeData = async (req: Request, res: Response) => {
  const { user_id, project_id, datasetUrl, modelUrl, attackMethod } = req.body;
  try {
    const analyseResult = await analyseService.analyzeData(Number(user_id), Number(project_id), datasetUrl, modelUrl, attackMethod);
    successResponse(res, { analyseResult }, '成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
};
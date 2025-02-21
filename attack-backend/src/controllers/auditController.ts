import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as auditService from '../services/auditService'

// 创建审计方法
export const createAuditInfo = async (req: Request, res: Response): Promise<void> => {
  const { audit_name } = req.body;

  try {
    // 调用服务层的创建审计方法逻辑
    const newData = await auditService.createAuditInfo(audit_name);
    successResponse(res, newData, '审计方法创建成功', 201);
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
    } else {
      errorResponse(res, "服务器内部错误", 500);
    }
  }
};

// 获取审计方法列表
export const getAuditInfoList = async (req: Request, res: Response): Promise<void> => {
  try {
    // 调用服务层获取审计方法列表逻辑
    const auditInfoList = await auditService.getAuditInfoList()
    successResponse(res, { auditInfoList }, '审计方法获取成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

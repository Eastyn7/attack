import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as projectService from '../services/projectService'

// 创建项目
export const createProjectList = async (req: Request, res: Response): Promise<void> => {
  const { user_id, data_id, project_name } = req.body;

  try {
    // 调用服务层的创建项目逻辑
    const newData = await projectService.createProjectList(Number(user_id), Number(data_id), project_name);
    successResponse(res, newData, '项目创建成功', 201);
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
    } else {
      errorResponse(res, "服务器内部错误", 500);
    }
  }
};

// 获取项目列表
export const getProjectList = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.body

  try {
    // 调用服务层获取项目列表逻辑
    const projectList = await projectService.getProjectList(Number(user_id))
    successResponse(res, { projectList }, '项目获取成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// 删除项目
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { user_id, project_name } = req.body

  try {
    // 调用服务层删除项目逻辑
    await projectService.deleteProject(Number(user_id), project_name)

    successResponse(res, {}, '项目删除成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
};
import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as dataService from '../services/dataService'
import { authenticateUser } from '../middlewares/authenticationMiddleware'

// 创建数据
export const createDataList = async (req: Request, res: Response): Promise<void> => {
  const { user_id, data_name } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // 从请求头中获取 token

  if (!token) {
    errorResponse(res, "没有提供 token，访问被拒绝", 401);
    return
  }
  
  try {
    // 这里调用身份验证的方法
    await authenticateUser(Number(user_id), token); // 确保用户身份验证通过

    const data_file = req.file?.buffer; // 从 req.file 中获取文件的 buffer
    if (!data_file) {
      errorResponse(res, '未上传文件', 400);
      return;
    }

    // 调用服务层的创建数据逻辑
    const newData = await dataService.createDataList(Number(user_id), data_name, data_file);
    successResponse(res, newData, '数据创建成功', 201);
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
    } else {
      errorResponse(res, "服务器内部错误", 500);
    }
  }
};

// 获取数据列表
export const getDataList = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.body

  try {
    // 调用服务层获取数据列表逻辑
    const dataList = await dataService.getDataList(Number(user_id))
    successResponse(res, { dataList }, '数据获取成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// 获取对应数据表链接地址
export const getFilePath = async (req: Request, res: Response): Promise<void> => {
  const { user_id, data_name } = req.body

  try {
    // 调用服务层获取数据列表逻辑
    const filePath = await dataService.getFilePath(Number(user_id), data_name)
  
    successResponse(res, { filePath }, '数据获取成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
};

// 删除数据文件
export const deleteDataFile = async (req: Request, res: Response): Promise<void> => {
  const { user_id, data_name } = req.body

  try {
    // 调用服务层删除数据文件逻辑
    await dataService.deleteDataFile(Number(user_id), data_name)
  
    successResponse(res, {}, '数据文件删除成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
};

// // 更新数据
// export const updateDataList = async (req: Request, res: Response): Promise<void> => {
//   const { data_id, data_name, other_data } = req.body

//   try {
//     // 调用服务层更新数据逻辑
//     const updateMessage = await dataService.updateDataList(data_id, { data_name, other_data })
//     successResponse(res, updateMessage, '数据更新成功', 200)
//   } catch (error) {
//     if (error instanceof Error) {
//       errorResponse(res, error.message, 400)
//     } else {
//       errorResponse(res, "服务器内部错误", 500)
//     }
//   }
// }

// // 删除数据
// export const deleteDataList = async (req: Request, res: Response): Promise<void> => {
//   const { data_id } = req.params

//   try {
//     // 调用服务层删除数据逻辑
//     const deleteMessage = await dataService.deleteDataList(Number(data_id))
//     successResponse(res, deleteMessage, '数据删除成功', 200)
//   } catch (error) {
//     if (error instanceof Error) {
//       errorResponse(res, error.message, 400)
//     } else {
//       errorResponse(res, "服务器内部错误", 500)
//     }
//   }
// }

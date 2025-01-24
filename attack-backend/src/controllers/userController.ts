import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as userService from '../services/userService'

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username,  password } = req.body

  try {
    // 验证成功则调用服务层注册用户逻辑
    const newUser = await userService.registerUser(username, password)
    successResponse(res, newUser, '用户注册成功', 201)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { loginInput, password } = req.body

  try {
    // 调用服务层登录逻辑
    const user = await userService.loginUser(loginInput, password)
    successResponse(res, { user }, '登录成功', 200)

  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.body

  try {
    const userInfo = await userService.getUserInfo(user_id)
    successResponse(res, { userInfo }, '获取信息成功', 200)

  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// export const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
//   const { user_id, updates } = req.body

//   try {
//     const result = await userService.updateUserInfo(user_id, updates)
//     successResponse(res, {}, result, 200)
//   } catch (error) {
//     if (error instanceof Error) {
//       errorResponse(res, error.message, 400)
//     } else {
//       errorResponse(res, "服务器内部错误", 500)
//     }
//   }
// }

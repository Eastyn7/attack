import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { User, UserRegister, UserLogin, UserInfo, UpdateUserInfo } from '../types';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { uploadImageToOSS } from '../oss'

// 注册用户
export const registerUser = async (username: string, password: string): Promise<UserRegister> => {
  // 查询用户名是否已存在
  const existingUser = await query<User[]>('SELECT * FROM User_login WHERE username = ?', [username]);
  if (existingUser.length > 0) {
    throw new Error('用户名已存在');
  }

  // 哈希密码
  const passwordHash = await hashPassword(password);

  // 插入新用户到数据库
  const result = await query<{ insertId: number }>(
    'INSERT INTO user_login (username, password_hash) VALUES (?, ?)',
    [username, passwordHash]
  );

  // 获取新插入用户的 user_id
  const userId = result.insertId;

  // 数据库触发器已写
  // // 更新 username 到 user_info 表
  // await query('UPDATE user_info SET username = ? WHERE user_id = ?', [username, userId]);

  // 返回新注册的用户信息（不包含 password_hash）
  const newUser: UserRegister = { user_id: userId, username };
  return newUser;
};


// 登录用户
export const loginUser = async (loginInput: string, password: string): Promise<{ user_id: number, username: string, token: string, expiresIn: number }> => {
  let UserLogin = await query<UserLogin[]>('SELECT * FROM User_login WHERE username = ?', [loginInput]);

  if (UserLogin.length === 0) {
    throw new Error('用户不存在');
  }

  // 验证密码是否匹配
  const validPassword = await comparePassword(password, UserLogin[0].password_hash);
  if (!validPassword) {
    throw new Error('密码错误');
  }

  // 生成JWT token
  const expiresIn = 3600; // 过期时间为3600秒（1小时）
  const token = 'Bearer ' + jwt.sign(
    { user_id: UserLogin[0].user_id, username: UserLogin[0].username },
    'ATTACK',
    { expiresIn: expiresIn } // 使用数字作为过期时间
  );

  // 返回用户信息和 token
  return {
    user_id: UserLogin[0].user_id,
    username: UserLogin[0].username,
    token,
    expiresIn
  };
};



// 获取用户的信息
export const getUserInfo = async (user_id: number): Promise<UserInfo> => {
  // 查询用户详细信息
  const userInfo = await query<UserInfo[]>(
    `SELECT 
      gender, avatar, phone, email
     FROM User_info 
     WHERE user_id = ?`,
    [user_id]
  );

  if (userInfo.length === 0) {
    throw new Error('用户信息不存在');
  }

  // 返回用户的详细信息
  return userInfo[0]; // 假设只会有一个匹配的用户
};


// // 更新用户信息
// export const updateUserInfo = async (user_id: number, updates: UpdateUserInfo): Promise<string> => {
//   const fields: string[] = []; // 用于存储 SQL 更新字段表达式
//   const values: any[] = []; // 用于存储对应字段的值

//   // 获取 UpdateUserInfo 类型中允许的字段
//   const allowedFields: Array<keyof UpdateUserInfo> = ['nickname', 'phone', 'gender', 'avatar', 'bio'];

//   // 如果有 avatar 字段，首先上传图片到阿里云
//   if (updates.avatar) {
//     try {
//       // 将 base64 图片上传到 OSS，获取 URL
//       const avatarUrl = await uploadImageToOSS(updates.avatar);
//       updates.avatar = avatarUrl; // 替换为上传到 OSS 后的图片 URL
//     } catch (error) {
//       throw new Error('头像上传失败');
//     }
//   }

//   // 处理允许的字段并生成 SQL 更新表达式
//   for (const key in updates) {
//     if (allowedFields.includes(key as keyof UpdateUserInfo) && updates[key as keyof UpdateUserInfo] !== "" && updates[key as keyof UpdateUserInfo] !== null && updates[key as keyof UpdateUserInfo] !== undefined) {
//       fields.push(`${key} = ?`);
//       values.push(updates[key as keyof UpdateUserInfo]);
//     }
//   }

//   // 如果没有可更新的字段，抛出异常
//   if (fields.length === 0) {
//     throw new Error('没有可更新的字段');
//   }

//   // 拼接 SQL 更新语句
//   const updateQuery = `UPDATE User_info SET ${fields.join(', ')} WHERE user_id = ?`;
//   values.push(user_id); // 将 user_id 添加到参数数组

//   try {
//     const result = await query<{ affectedRows: number }>(updateQuery, values);
//     return result.affectedRows > 0 ? '更新成功' : '用户不存在或无更改';
//   } catch (error) {
//     throw new Error('更新用户信息失败');
//   }
// };

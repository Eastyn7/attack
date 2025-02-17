import { query } from '../db';
import { DataList } from '../types';
import { uploadExcelToOSS } from '../oss'

// 创建数据
export const createDataList = async (user_id: number, data_name: string, data_file: Buffer): Promise<any> => {
  // 查询数据名称是否已存在，确保同一用户不能有相同的 data_name
  const existingData = await query<DataList[]>('SELECT * FROM data_list WHERE user_id = ? AND data_name = ?', [user_id, data_name]);
  if (existingData.length > 0) {
    throw new Error('同一用户不能有相同的数据表名称');
  }

  // 将文件上传到 OSS，获取 URL
  const file_path = await uploadExcelToOSS(data_file, data_name);

  // 插入新数据到 data_list 表
  const result = await query<{ insertId: number }>(
    'INSERT INTO data_list (user_id, data_name, file_path) VALUES (?, ?, ?)',
    [user_id, data_name, file_path]
  );

  // 获取新插入的 data_id
  const dataId = result.insertId;

  return { data_id: dataId, user_id, data_name };
};


// 获取数据列表
export const getDataList = async (user_id: number): Promise<DataList[]> => {
  // 查询当前用户的所有数据
  const dataList = await query<DataList[]>('SELECT data_name, updated_at FROM data_list WHERE user_id = ?', [user_id]);

  if (dataList.length === 0) {
    throw new Error('没有找到数据');
  }

  // 返回用户的数据列表
  return dataList;
};


// 获取对应数据表链接地址
export const getFilePath = async (user_id: number, data_name: string): Promise<string> => {
  // 修正 SQL 查询语句，使用 AND 连接多个条件
  // 明确查询结果是包含 RowDataPacket 对象的数组，每个对象有 file_path 属性
  const result = await query<{ file_path: string }[]>('SELECT file_path FROM data_list WHERE user_id = ? AND data_name = ?', [user_id, data_name]);

  // 检查查询结果数组的长度，如果为 0 则抛出错误
  if (result.length === 0) {
    throw new Error('没有找到数据');
  }

  // 从数组中提取第一个元素的 file_path 属性
  const filePath = result[0].file_path;

  // 返回单个文件路径字符串
  return filePath;
};


// // 更新数据
// export const updateDataList = async (data_id: number, updates: { data_name?: string, other_data?: any }): Promise<string> => {
//   const fields: string[] = [];
//   const values: any[] = [];

//   // 更新 data_name 字段时，检查是否存在相同名称的数据（同一用户）
//   if (updates.data_name) {
//     const existingData = await query('SELECT * FROM data_list WHERE data_name = ? AND data_id != ?', [updates.data_name, data_id]);
//     if (existingData.length > 0) {
//       throw new Error('data_name 已存在');
//     }
//     fields.push('data_name = ?');
//     values.push(updates.data_name);
//   }

//   if (updates.other_data !== undefined) {
//     fields.push('other_data = ?');
//     values.push(updates.other_data);
//   }

//   // 如果没有任何字段更新，抛出错误
//   if (fields.length === 0) {
//     throw new Error('没有可更新的字段');
//   }

//   // 拼接更新语句
//   const updateQuery = `UPDATE data_list SET ${fields.join(', ')} WHERE data_id = ?`;
//   values.push(data_id);

//   // 执行更新
//   try {
//     const result = await query<{ affectedRows: number }>(updateQuery, values);
//     return result.affectedRows > 0 ? '更新成功' : '数据不存在或无更改';
//   } catch (error) {
//     throw new Error('更新数据失败');
//   }
// };


// // 删除数据
// export const deleteDataList = async (data_id: number): Promise<string> => {
//   // 检查数据是否存在
//   const existingData = await query('SELECT * FROM data_list WHERE data_id = ?', [data_id]);
//   if (existingData.length === 0) {
//     throw new Error('数据不存在');
//   }

//   // 删除数据
//   try {
//     const result = await query<{ affectedRows: number }>('DELETE FROM data_list WHERE data_id = ?', [data_id]);
//     return result.affectedRows > 0 ? '删除成功' : '删除失败';
//   } catch (error) {
//     throw new Error('删除数据失败');
//   }
// };

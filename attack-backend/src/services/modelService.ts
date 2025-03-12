import { uploadModelToOSS } from '../oss'

// 上传模型
export const uploadModelFile = async (user_id: number, model_name: string, file_type: string, model_file: Buffer): Promise<any> => {

  // 将文件上传到 OSS，获取 URL
  const file_path = await uploadModelToOSS(model_file, model_name, file_type);

  return { user_id, model_name, file_type, file_path };
};

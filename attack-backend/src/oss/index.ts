import OSS from 'ali-oss';

// 初始化 OSS 客户端
const client = new OSS({
  region: 'oss-cn-chengdu', 
  accessKeyId: 'LTAI5tPMxqNbJ91VyJqcgGoV',
  accessKeySecret: 'IeGTiMcbZYK2WtSfj05uR2bUucUqVX',
  bucket: 'attack-oss',
});

// 上传 Excel 文件到 OSS
export const uploadExcelToOSS = async (fileBuffer: Buffer, data_name: string): Promise<string> => {
  const fileName = `excel/${Date.now()}_${data_name}.xlsx`;

  const bucket = 'attack-oss';
  const region = 'oss-cn-chengdu';

  try {
    const result = await client.put(fileName, fileBuffer, {
      headers: {
        'Cache-Control': 'max-age=31536000',
        'x-oss-acl': 'public-read',
      },
    });

    const fileUrl = `https://${bucket}.${region}.aliyuncs.com/${result.name}`;

    return fileUrl;
  } catch (error) {
    console.error('上传失败:', error);
    throw new Error('上传到 OSS 失败');
  }
};


// 上传图片到 OSS
export const uploadImageToOSS = async (base64Image: string): Promise<string> => {
  const fileName = `avatars/${Date.now()}.png`;
  const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const bucket = 'attack-oss';
  const region = 'oss-cn-chengdu';

  try {
    const result = await client.put(fileName, buffer, {
      headers: {
        'Cache-Control': 'max-age=31536000',
        'x-oss-acl': 'public-read',
      },
    });

    const fileUrl = `https://${bucket}.${region}.aliyuncs.com/${result.name}`;

    return fileUrl;
  } catch (error) {
    console.error('上传失败:', error);
    throw new Error('上传到 OSS 失败');
  }
};


// 上传模型文件到 OSS
export const uploadModelToOSS = async (fileBuffer: Buffer, model_name: string, file_type: string): Promise<string> => {
  const fileName = `models/${Date.now()}_${model_name}.${file_type}`;

  const bucket = 'attack-oss';
  const region = 'oss-cn-chengdu';

  try {
    const result = await client.put(fileName, fileBuffer, {
      headers: {
        'Cache-Control': 'max-age=31536000',
        'x-oss-acl': 'public-read',
      },
    });

    const fileUrl = `https://${bucket}.${region}.aliyuncs.com/${result.name}`;

    return fileUrl;
  } catch (error) {
    console.error('上传失败:', error);
    throw new Error('上传到 OSS 失败');
  }
};


// 从 OSS 删除文件
export const deleteFileFromOSS = async (fileName: string): Promise<void> => {
  try {
    await client.delete(fileName);
  } catch (error) {
    throw new Error('从 OSS 删除文件失败');
  }
};

// 从完整 OSS URL 中提取文件名
export const extractFileNameFromOSSUrl = (url: string): string => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};
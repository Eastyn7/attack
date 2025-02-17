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

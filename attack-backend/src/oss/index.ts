import OSS from 'ali-oss';

// 初始化 OSS 客户端
const client = new OSS({
  region: 'oss-cn-chengdu', // 区域，例如 'oss-cn-hangzhou'
  accessKeyId: 'LTAI5tPMxqNbJ91VyJqcgGoV', // AccessKeyId
  accessKeySecret: 'IeGTiMcbZYK2WtSfj05uR2bUucUqVX', // AccessKeySecret
  bucket: 'attack_project', // 存储空间名称
});

// 上传图片到 OSS
export const uploadImageToOSS = async (base64Image: string): Promise<string> => {
  const fileName = `avatars/${Date.now()}.png`;
  const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const bucket = 'ctbu-cqt';  // 用您的实际 bucket 名称替换
  const region = 'oss-cn-chengdu';  // 用您的实际 region 替换

  try {
    // 上传图片到 OSS，设置缓存控制
    const result = await client.put(fileName, buffer, {
      headers: {
        'Cache-Control': 'max-age=31536000', // 设置缓存过期时间为一年
        'x-oss-acl': 'public-read', // 设置文件权限为 public-read
      },
    });

    // 构造文件的访问 URL
    const fileUrl = `https://${bucket}.${region}.aliyuncs.com/${result.name}`;

    return fileUrl;
  } catch (error) {
    console.error('上传失败:', error);
    throw new Error('上传到 OSS 失败');
  }
};

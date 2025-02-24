import axios from 'axios';

// 调用智谱清言API的函数
const callAiApi = async (data: object) => {
  try {
    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      data,
      {
        headers: {
          'Authorization': `Bearer dfb4618f23f1416c903800f0e0075510.b9s4Zxolj7elcC81`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('调用智谱清言API失败:', error);
    throw new Error('AI API调用失败');
  }
};

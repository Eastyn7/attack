import axios from 'axios';

// 调用智谱清言API的函数
export const callAiApi = async (content: string) => {
  try {
    // 正确的请求体格式
    const body = {
      model: "glm-4",       // 模型选择
      temperature: 0.9,     // 核采样阈值
      "top-k": 4,           // 平衡生成文本的质量和多样性
      max_tokens: 1000,     // 模型回答的tokens最大长度
      messages: [
        {
          role: "system",  // 角色设定
          content: "你是一个智能助手，你既可以简单地与用户进行友好的对话回答用户提出的日常简单的问题，也可以作为隐私保护专家回答专业问题，专门评估和分析机器学习模型的隐私泄露风险，特别是在医疗行业中，你的目标是为医疗机构提供有效的风险评估和解决方案。"
        },
        {
          role: "user",  // 用户角色
          content: content  // 用户输入
        }
      ]
    };

    // 正确的请求头
    const headers = {
      'Authorization': `Bearer dfb4618f23f1416c903800f0e0075510.b9s4Zxolj7elcC81`,
      'Content-Type': 'application/json'
    };

    // 发送请求
    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      body, // 请求体
      { headers } // 请求头
    );

    // 返回生成的内容
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('调用智谱清言API失败:', error);
    throw new Error('AI API调用失败');
  }
};

import http from '@/utils/http'
import type { CustomRequestConfig } from '@/utils/http'

// 发送邮件验证码请求
const sendVerificationCode = async (data: string, needToken = false) => {
	try {
		const response = await http.post('/public/mail', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('登录请求失败:', error)
		throw error
	}
}

// 默认导出
export default {
	sendVerificationCode,
}

import http from '@/utils/http'
import type { CustomRequestConfig } from '@/utils/http'

// 登录请求
const login = async (data: string, needToken = false) => {
	try {
		const response = await http.post('/public/login', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('登录请求失败:', error)
		throw error
	}
}

// 注册请求
const register = async (data: string, needToken = false) => {
	try {
		const response = await http.post('/public/register', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('注册请求失败:', error)
		throw error
	}
}

// 默认导出
export default {
	login,
	register,
}

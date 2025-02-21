import http from '@/utils/http'
import type { CustomRequestConfig } from '@/utils/http'

// 上传审计方法请求
const createAuditInfo = async (data: string, needToken = true) => {
	try {
		const response = await http.post('/audit//createauditinfo', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('上传审计方法请求失败:', error)
		throw error
	}
}

// 获取审计方法文件列表请求
const getAuditInfoList = async (needToken = false) => {
	try {
		const response = await http.get('/public/getauditinfolist', {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('获取用户审计方法文件列表请求失败:', error)
		throw error
	}
}

// 默认导出
export default {
	createAuditInfo,
	getAuditInfoList,
}

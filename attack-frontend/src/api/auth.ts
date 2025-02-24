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

// 获取用户信息请求
const getUserInfo = async (data: string, needToken = true) => {
	try {
		const response = await http.post('/user/getuserinfo', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('获取用户信息请求失败:', error)
		throw error
	}
}

// 更新用户信息请求
const updateUserInfo = async (data: string, needToken = true) => {
	try {
		const response = await http.put('/user/updateuserinfo', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('更新用户信息请求失败:', error)
		throw error
	}
}

// 上传数据文件请求
const createDataList = async (data: FormData, needToken = true) => {
	try {
		// 设置请求头
		const headers = {
			'Content-Type': 'multipart/form-data',
		}
		const response = await http.post('/datalist/createdatalist', data, {
			needToken,
			headers,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('上传数据文件请求失败:', error)
		throw error
	}
}

// 获取用户数据文件列表请求
const getDataList = async (data: string, needToken = true) => {
	try {
		const response = await http.post('/datalist/getdatalist', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('获取用户数据文件列表请求失败:', error)
		throw error
	}
}

// 获取用户数据文件地址请求
const getFilePath = async (data: string, needToken = true) => {
	try {
		const response = await http.post('/datalist/getfilepath', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('获取用户数据文件列表请求失败:', error)
		throw error
	}
}

// 删除数据文件
const deleteDataFile = async (data: string, needToken = true) => {
	try {
		const response = await http.delete('/datalist/deletedatafile', {
			data,
			...({ needToken } as CustomRequestConfig),
		})
		return response
	} catch (error) {
		console.error('删除用户数据文件请求失败:', error)
		throw error
	}
}

// 上传项目请求
const createProjectList = async (data: string, needToken = true) => {
	try {
		const response = await http.post('/projectlist/createprojectlist', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('上传项目请求失败:', error)
		throw error
	}
}

// 获取用户项目文件列表请求
const getProjectList = async (data: string, needToken = true) => {
	try {
		const response = await http.post('/projectlist/getprojectlist', data, {
			needToken,
		} as CustomRequestConfig)
		return response
	} catch (error) {
		console.error('获取用户项目文件列表请求失败:', error)
		throw error
	}
}

// 删除项目
const deleteProject = async (data: string, needToken = true) => {
	try {
		const response = await http.delete('/projectlist/deleteproject', {
			data,
			...({ needToken } as CustomRequestConfig),
		})
		return response
	} catch (error) {
		console.error('删除项目失败:', error)
		throw error
	}
}

// 默认导出
export default {
	login,
	register,
	getUserInfo,
	updateUserInfo,
	createDataList,
	getDataList,
	getFilePath,
	deleteDataFile,
	createProjectList,
	getProjectList,
	deleteProject,
}

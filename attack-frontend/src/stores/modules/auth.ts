import { defineStore } from 'pinia'
import { StoreNames } from './store_names'
import api from '@/api/index'
import { formToJson } from '@/utils/formToJson'
import type { UploadRawFile } from 'element-plus'

type Gender = 0 | 1 | 2 // 0: 保密, 1: 男, 2: 女

export interface UserInfo {
	user_id: number
	email: string
	username: string
	gender: Gender
	avatar: string
	phone: string
}

export const useUserStore = defineStore(StoreNames.USER, {
	state: () => ({
		userInfo: <UserInfo>{
			user_id: 0,
			email: '',
			username: '',
			gender: 0,
			avatar: '',
			phone: '',
		},
		token: '',
		tokenExpiresAt: 0,
		rememberMe: false,
	}),

	persist: true,

	actions: {
		// 注册
		async register(data: string) {
			try {
				const result = await api.auth.register(data)
				const { username } = result.data
				this.setUsername(username)
			} catch (error) {
				console.error('注册失败', error)
				throw error
			}
		},
		// 登录
		async login(data: string) {
			try {
				const result = await api.auth.login(data)
				if (result.status) {
					const { user_id, token, expiresIn } = result.data.user

					// 存储 token 和用户认证信息
					this.setToken(token)
					this.setUserId(user_id)

					// 计算 token 的过期时间
					this.tokenExpiresAt = Date.now() + expiresIn * 1000

					// 登录成功后获取用户信息
					const jsonData = formToJson({ user_id })
					await this.getUserInfo(jsonData)
				} else {
					console.error('登录失败')
					throw Error
				}
			} catch (error) {
				console.error('登录失败', error)
				throw error
			}
		},
		// 获取信息
		async getUserInfo(data: string) {
			try {
				const result = await api.auth.getUserInfo(data)

				if (result.status) {
					const userInfo = result.data.userInfo
					this.userInfo = { ...this.userInfo, ...userInfo }
				}
			} catch (error) {
				console.error('获取用户信息失败', error)
				throw error
			}
		},
		// 更新信息
		async updateUserInfo(data: string) {
			try {
				const result = await api.auth.updateUserInfo(data)

				if (result.status) {
					// 更新成功，重新获取最新的用户信息
					const jsonData = formToJson({ user_id: this.userInfo.user_id })
					await this.getUserInfo(jsonData)
				}
			} catch (error) {
				console.error('更新用户信息失败', error)
				throw error
			}
		},
		// 退出登录
		logOut() {
			if (this.rememberMe) {
				// 清空 Pinia store 中的所有相关信息
				this.setToken('')
				this.setTokenExpiresAt(0)
			} else {
				// 清空 Pinia store 中的所有相关信息
				this.setToken('')
				this.setTokenExpiresAt(0)
				this.setUserInfo({
					user_id: 0,
					email: '',
					username: '',
					gender: 0,
					avatar: '',
					phone: '',
				})

				// 清除 localStorage 中保存的 'ATTACK-USER' 键和值
				localStorage.removeItem('ATTACK-USER')
			}

			// 强制刷新页面，确保状态更新
			location.reload()
		},
		// 清除UserInfo
		clearUserInfo() {
			this.userInfo = {
				user_id: 0,
				email: '',
				username: '',
				gender: 0,
				avatar: '',
				phone: '',
			}
		},

		// 添加我的数据文件列表
		async createDataList(data_name: string, data_file: UploadRawFile) {
			try {
				// 创建 FormData 对象
				const formData = new FormData()
				formData.append('user_id', String(this.userInfo.user_id))
				formData.append('data_name', data_name)
				formData.append('data_file', data_file)

				const result = await api.auth.createDataList(formData)

				if (result.status) {
					return result.data.dataList
				}
			} catch (error) {
				console.error('添加文件失败', error)
				throw error
			}
		},
		// 获取用户数据文件列表
		async getDataList() {
			try {
				const jsonData = formToJson({ user_id: this.userInfo.user_id })
				const result = await api.auth.getDataList(jsonData)

				if (result.status) {
					return result.data.dataList
				}
			} catch (error) {
				console.error('获取用户数据文件列表失败', error)
				throw error
			}
		},
		// 获取数据文件地址
		async getFilePath(data_name: string) {
			try {
				const jsonData = formToJson({
					user_id: this.userInfo.user_id,
					data_name,
				})
				const result = await api.auth.getFilePath(jsonData)
				if (result.status) {
					return result.data.filePath
				}
			} catch (error) {
				console.error('获取用户数据文件列表失败', error)
				throw error
			}
		},
		// 删除数据文件
		async deleteDataFile(data_name: string) {
			try {
				const jsonData = formToJson({
					user_id: this.userInfo.user_id,
					data_name,
				})
				const result = await api.auth.deleteDataFile(jsonData)
				if (result.status) {
					return '删除成功'
				}
			} catch (error) {
				console.error('删除文件失败', error)
				throw error
			}
		},

		// 添加分析项目
		async createProjectList(project_name: string, data_id: number) {
			try {
				const data = formToJson({
					user_id: this.userInfo.user_id,
					data_id,
					project_name,
				})
				const result = await api.auth.createProjectList(data)
				if (result.status) {
					return result.data.projectList
				}
			} catch (error) {
				console.error('添加分析项目失败', error)
				throw error
			}
		},
		// 获取用户分析项目列表
		async getProjectList() {
			try {
				const jsonData = formToJson({ user_id: this.userInfo.user_id })
				const result = await api.auth.getProjectList(jsonData)

				if (result.status) {
					return result.data.projectList
				}
			} catch (error) {
				console.error('获取用户分析项目列表失败', error)
				throw error
			}
		},
		// 删除项目
		async deleteProject(project_name: string) {
			try {
				const jsonData = formToJson({
					user_id: this.userInfo.user_id,
					project_name,
				})
				const result = await api.auth.deleteProject(jsonData)
				if (result.status) {
					return '删除成功'
				}
			} catch (error) {
				console.error('删除文件失败', error)
				throw error
			}
		},

		// 单独的 setter 方法
		setUserInfo(userInfo: UserInfo) {
			this.userInfo = userInfo
		},

		setUserId(userId: number) {
			this.userInfo.user_id = userId
		},

		setEmail(email: string) {
			this.userInfo.email = email
		},

		setUsername(username: string) {
			this.userInfo.username = username
		},

		setGender(gender: Gender) {
			this.userInfo.gender = gender
		},

		setAvatar(avatar: string) {
			this.userInfo.avatar = avatar
		},

		setPhone(phone: string) {
			this.userInfo.phone = phone
		},

		setToken(token: string) {
			this.token = token
		},

		setTokenExpiresAt(expiresAt: number) {
			this.tokenExpiresAt = expiresAt
		},

		setRememberMe(rememberMe: boolean) {
			this.rememberMe = rememberMe
		},
	},
})

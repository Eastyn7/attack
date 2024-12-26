import { defineStore } from 'pinia'
import { StoreNames } from './store_names'
import api from '@/api/index'

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
				} else {
					console.error('登录失败')
					throw Error
				}
			} catch (error) {
				console.error('登录失败', error)
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

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { useUserStore } from '@/stores'
	import { formToJson } from '@/utils/formToJson'

	type Gender = 0 | 1 | 2 // 0: 保密, 1: 男, 2: 女
	type Updates = Partial<Record<keyof UserInfo, string | Gender | undefined>>

	interface UserInfo {
		email: string
		username: string
		gender: Gender
		phone: string
	}

	const userStore = useUserStore()

	const userInfo = ref<UserInfo>({
		email: '默认邮箱',
		username: '默认用户名',
		gender: 0,
		phone: '默认联系方式',
	})
	const originalUserInfo = ref<UserInfo>({ ...userInfo.value })

	const submitForm = async () => {
		const updates: Updates = {}

		for (const key in userInfo.value) {
			const typedKey = key as keyof UserInfo
			if (userInfo.value[typedKey] !== originalUserInfo.value[typedKey]) {
				updates[typedKey] = userInfo.value[typedKey]
			}
		}

		if (Object.keys(updates).length > 0) {
			try {
				// 提交修改
				await userStore.updateUserInfo(
					formToJson({ user_id: userStore.userInfo.user_id, updates }),
				)
				// 提示用户
				originalUserInfo.value = { ...userInfo.value }
				ElMessage.success('修改成功')
			} catch (error: any) {
				ElMessage.error(error.response.data.message || '上传失败')
			}
		} else {
			ElMessage.success('没有修改任何信息')
		}
	}

	onMounted(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { avatar, user_id, ...rest } = userStore.userInfo
		userInfo.value = { ...rest }
		originalUserInfo.value = { ...userInfo.value }
	})
</script>

<template>
	<div class="UPP-layout">
		<el-container class="UPP-container">
			<el-main class="UPP-main">
				<page-container title="用户账号信息">
					<el-form :model="userInfo" label-width="100px">
						<el-form-item label="账号ID">
							<el-input
								v-model="userStore.userInfo.user_id"
								style="width: 90%"
								disabled
							></el-input>
						</el-form-item>
						<el-form-item label="用户名">
							<el-input
								v-model="userInfo.username"
								style="width: 90%"
							></el-input>
						</el-form-item>
						<el-form-item label="性别">
							<el-input v-model="userInfo.gender" style="width: 90%"></el-input>
						</el-form-item>
						<el-form-item label="邮箱">
							<el-input v-model="userInfo.email" style="width: 90%"></el-input>
						</el-form-item>
						<el-form-item label="联系方式">
							<el-input v-model="userInfo.phone" style="width: 90%"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm">提交修改</el-button>
						</el-form-item>
					</el-form>

					<el-text type="info" class="infoText">
						请注意谨慎修改个人信息
					</el-text>
				</page-container>
			</el-main>
		</el-container>
	</div>
</template>

<style scoped>
	.UPP-layout {
		width: 100%;
		height: 100%;
	}

	.UPP-container {
		width: 100%;
		height: 100%;
	}

	.UPP-header {
		background-color: rgb(142, 142, 142);
		width: 100%;
	}

	.infoText {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
</style>

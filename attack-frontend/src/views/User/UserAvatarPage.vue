<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { Plus, Upload } from '@element-plus/icons-vue'
	import { useUserStore } from '@/stores'
	import { formToJson } from '@/utils/formToJson'
	import type { ElUpload } from 'element-plus'

	const userStore = useUserStore()
	const imgUrl = ref<string | null>(userStore.userInfo.avatar)
	const uploadRef = ref<InstanceType<typeof ElUpload> | null>(null)

	// 压缩图片函数
	const compressImage = (
		file: File,
		maxWidth = 800,
		quality = 0.7,
	): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = (event) => {
				const img = new Image()
				img.src = event.target?.result as string

				img.onload = () => {
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')!

					let width = img.width
					let height = img.height

					if (width > maxWidth) {
						height = (height * maxWidth) / width
						width = maxWidth
					}

					canvas.width = width
					canvas.height = height
					ctx.drawImage(img, 0, 0, width, height)

					// 压缩图片质量
					const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
					resolve(compressedBase64)
				}

				img.onerror = (error) => reject(error)
			}

			reader.onerror = (error) => reject(error)
		})
	}

	const handleFileChange = async (uploadFile: any) => {
		const file = uploadFile.raw as File
		if (file) {
			try {
				// 基于 FileReader 读取图片做预览
				const reader = new FileReader()
				reader.readAsDataURL(file)
				reader.onload = async () => {
					if (typeof reader.result === 'string') {
						// 压缩图片
						const compressedBase64 = await compressImage(file)
						imgUrl.value = compressedBase64
						ElMessage.success('头像压缩并上传成功')
					}
				}
			} catch (error) {
				console.error('头像上传失败，请重试', error)
			}
		}
	}

	const handleSelectImage = () => {
		if (uploadRef.value) {
			uploadRef.value.$el.querySelector('input')?.click()
		}
	}

	const onUpdateAvatar = async () => {
		try {
			// 发送请求更新头像
			await userStore.updateUserInfo(
				formToJson({
					user_id: userStore.userInfo.user_id,
					updates: { avatar: imgUrl.value },
				}),
			)

			// 提示用户
			ElMessage.success('头像更新成功')
		} catch (error: any) {
			// 处理请求失败的情况
			ElMessage.error(error.response.data.message || '头像更新失败')
		}
	}
</script>

<template>
	<page-container title="更换头像">
		<el-upload
			ref="uploadRef"
			:auto-upload="false"
			class="avatar-uploader"
			accept="image/*"
			:show-file-list="false"
			:on-change="handleFileChange"
		>
			<img v-if="imgUrl" :src="imgUrl" class="avatar" />
			<el-icon v-else class="avatar-uploader-icon">
				<Plus />
			</el-icon>
		</el-upload>

		<br />

		<el-button
			@click="handleSelectImage"
			type="primary"
			:icon="Plus"
			size="large"
		>
			选择图片
		</el-button>
		<el-button
			@click="onUpdateAvatar"
			type="success"
			:icon="Upload"
			size="large"
		>
			上传头像
		</el-button>
	</page-container>
</template>

<style scoped>
	.avatar-uploader {
		width: 278px;
		height: 278px;
		border: 1px dashed #000000;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar {
		width: 278px;
		height: 278px;
		display: block;
	}

	.avatar-uploader:hover {
		border-color: #409eff;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 278px;
		height: 278px;
		text-align: center;
	}

	.avatar-uploader-icon:hover {
		color: #409eff;
	}
</style>

<script setup lang="ts">
	import { useUserStore } from '@/stores'

	const userStore = useUserStore()
	const formRef = ref()

	const form = ref({
		...userStore.userInfo,
	})
</script>

<template>
	<div class="UPP-layout">
		<el-container class="UPP-container">
			<el-main class="UPP-main">
				<page-container title="用户账号信息">
					<el-form ref="formRef" :model="form" label-width="100px">
						<el-form-item label="账号ID">
							<el-input
								v-model="form.user_id"
								style="width: 90%"
								disabled
							></el-input>
						</el-form-item>
						<el-form-item label="用户名">
							<el-input
								v-model="form.username"
								style="width: 90%"
								disabled
							></el-input>
						</el-form-item>
						<el-form-item label="性别">
							<el-input
								v-model="form.gender"
								style="width: 90%"
								disabled
							></el-input>
						</el-form-item>
						<el-form-item label="邮箱">
							<el-input
								v-model="form.email"
								style="width: 90%"
								disabled
							></el-input>
						</el-form-item>
						<el-form-item label="联系方式">
							<el-input
								v-model="form.phone"
								style="width: 90%"
								disabled
							></el-input>
						</el-form-item>
					</el-form>

					<el-text type="info" class="infoText">
						请注意个人信息目前不支持自己修改
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

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { More, Delete, Document } from '@element-plus/icons-vue'
	import { useUserStore } from '@/stores'
	import { formatDate } from '@/utils/util'

	interface FormData {
		data_id: number | string
		project_name: string
	}

	const userStore = useUserStore()
	const router = useRouter()

	const drawer = ref(false)
	const projectList = ref<any[]>([])
	const loading = ref(false)
	const formData = ref<FormData>({
		data_id: '',
		project_name: '',
	})
	const dataNameOptions = ref<any[]>([])

	const handleRowClick = (row: any) => {
		router.push({
			path: '/analyse/details',
			query: {
				project_name: row.project_name,
				data_name: row.data_name,
			},
		})
	}
	const handleDelete = async (row: any) => {
		loading.value = true
		try {
			const result = await userStore.deleteProject(row.project_name)
			if (result) {
				ElMessage.success(result)
			}
			const data = await userStore.getProjectList()
			projectList.value = data
		} catch (error: any) {
			ElMessage.error(error.message || '删除失败')
		} finally {
			loading.value = false
		}
	}
	const handleMore = (event: MouseEvent) => {
		event.stopPropagation()
	}
	const uploadFileClick = async () => {
		try {
			// 调用 userStore 中的 getDataList 方法获取数据列表
			const options = await userStore.getDataList()
			// 处理数据，将 data_id 映射到 value，data_name 映射到 label
			dataNameOptions.value = options.map((item: any) => ({
				value: item.data_id,
				label: item.data_name,
			}))
		} catch (error: any) {
			console.log(error.response.data.message)
			// 显示错误消息
			ElMessage.error('暂无已上传的文件请前往上传')
		} finally {
			// 打开抽屉
			drawer.value = true
		}
	}
	const cancelUploadClick = () => {
		formData.value = {
			data_id: '',
			project_name: '',
		}
		drawer.value = false
	}

	const submitForm = async () => {
		if (!formData.value.project_name) {
			ElMessage.warning('请输入项目名')
			return
		}
		if (!formData.value.data_id) {
			ElMessage.warning('请输入文件名')
			return
		}

		const loadingInstance = ElLoading.service({
			fullscreen: true,
			text: '正在上传...',
		})

		try {
			await userStore.createProjectList(
				formData.value.project_name,
				Number(formData.value.data_id),
			)
			ElMessage.success('上传成功')
			const data = await userStore.getProjectList()
			projectList.value = data
			drawer.value = false
			formData.value.project_name = ''
			formData.value.data_id = ''
		} catch (error: any) {
			ElMessage.error(error.response.data.message || '上传失败')
		} finally {
			loadingInstance.close()
		}
	}

	onMounted(async () => {
		try {
			loading.value = true
			const data = await userStore.getProjectList()
			projectList.value = data
		} catch (error) {
			console.error('获取数据列表失败:', error)
		} finally {
			loading.value = false
		}
	})
</script>

<template>
	<el-container class="ADPP-container">
		<el-header class="ADPP-header">
			<div class="left">
				<span class="iconfont icon-biaoqian"></span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/analyse' }">
						数据分析
					</el-breadcrumb-item>
					<el-breadcrumb-item> 分析项目 </el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-button type="primary" @click="uploadFileClick">
				创建分析项目
			</el-button>
		</el-header>
		<el-main class="ADPP-main">
			<el-container class="ADPP-detail-container">
				<el-table
					class="ADPP-detail-table"
					fit
					:data="projectList"
					v-loading="loading"
					:header-cell-style="{
						background: '#eef1f6',
						color: '#c5c5c5c5',
						fontSize: '15px',
					}"
					@row-click="handleRowClick"
				>
					<el-table-column fixed label="项目名称" prop="project_name">
						<template #default="{ row }">
							<span class="iconfont icon-wenjianjia"></span>
							{{ row.project_name }}
						</template>
					</el-table-column>
					<el-table-column fixed label="文件名称" prop="data_name">
						<template #default="{ row }">
							<span class="iconfont icon-excel"></span>
							{{ row.data_name }}
						</template>
					</el-table-column>
					<el-table-column label="更新时间" prop="updated_at" width="400">
						<template #default="{ row }">
							{{ formatDate(row.updated_at) }}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template #default="{ row }">
							<el-dropdown placement="bottom-end">
								<el-button
									circle
									plain
									type="primary"
									:icon="More"
									@click="handleMore($event)"
								></el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item @click="handleRowClick(row)">
											<el-icon> <Document /> </el-icon>查看详情
										</el-dropdown-item>
										<el-dropdown-item @click="handleDelete(row)">
											<el-icon> <Delete /> </el-icon>删除
										</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</el-container>
		</el-main>
	</el-container>

	<el-drawer v-model="drawer" direction="rtl">
		<template #header>
			<h4>创建分析项目</h4>
		</template>
		<template #default>
			<div>
				<el-input
					v-model="formData.project_name"
					placeholder="请输入项目名"
					style="margin-bottom: 20px"
				></el-input>
				<el-select v-model="formData.data_id" placeholder="请选择已有文件">
					<el-option
						v-for="item in dataNameOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
				<el-divider content-position="left">
					如果想使用新数据文件请前往
					<router-link
						to="/mydata"
						style="text-decoration: none; color: #409eff"
						>我的数据</router-link
					>
					进行上传
				</el-divider>
				<br />
				<el-button size="small" type="primary" @click="submitForm">
					立即上传
				</el-button>
				<el-button size="small" @click="cancelUploadClick"> 取消 </el-button>
			</div>
		</template>
	</el-drawer>
</template>

<style scoped>
	.ADPP-container {
		width: 100%;
		height: 100%;
	}

	.ADPP-header {
		width: 100%;
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.left {
			display: flex;
			align-items: center;
		}

		.iconfont {
			font-size: 20px;
			margin-right: 5px;
		}
	}

	.ADPP-main {
		width: 100%;
		height: 100%;
		padding-top: 0;
	}

	.ADPP-detail-container {
		width: 100%;
		height: 100%;
	}

	.ADPP-detail-table {
		height: 100%;

		.iconfont {
			font-size: 40px;
			margin-right: 10px;
		}
	}

	:deep(.el-table td .cell) {
		height: 50px;
		line-height: 50px;
		font-size: 15px;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
</style>

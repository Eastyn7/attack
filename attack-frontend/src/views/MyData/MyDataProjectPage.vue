<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import {
		More,
		// Edit,
		Delete,
		Document,
		UploadFilled,
		Download,
	} from '@element-plus/icons-vue'
	import { useUserStore } from '@/stores'
	import { formatDate } from '@/utils/util'
	import type { UploadFile, UploadRawFile, UploadUserFile } from 'element-plus'

	interface FormData {
		data_name: string
		data_file?: UploadRawFile
	}

	const userStore = useUserStore()
	const router = useRouter()

	const drawer = ref(false)
	const projectList = ref<any[]>([])
	const loading = ref(false)
	const formData = ref<FormData>({
		data_name: '',
	})
	const limitNum = ref(1) // 上传Excel时，同时允许上传的最大数
	const fileList = ref<any[]>([]) // Excel文件列表

	const handleRowClick = (row: any) => {
		router.push({
			path: '/mydata/details',
			query: {
				data_name: row.data_name,
			},
		})
	}
	const handleMore = (event: MouseEvent) => {
		event.stopPropagation()
	}
	const uploadFileClick = () => {
		drawer.value = true
	}
	const cancelUploadClick = () => {
		fileList.value = []
		formData.value.data_name = ''
		drawer.value = false
	}
	const handleDownload = async (row: any) => {
		loading.value = true
		try {
			const excelFilePath = await userStore.getFilePath(row.data_name)
			const link = document.createElement('a')
			link.href = excelFilePath
			link.setAttribute('download', row.data_name)
			link.click()

			ElMessage.success('下载成功')
		} catch (error: any) {
			ElMessage.error(error.message || '下载失败')
		} finally {
			loading.value = false
		}
	}
	const handleDelete = async (row: any) => {
		loading.value = true
		try {
			const result = await userStore.deleteDataFile(row.data_name)
			if (result) {
				ElMessage.success(result)
			}
			const data = await userStore.getDataList()
			projectList.value = data
		} catch (error: any) {
			ElMessage.error(error.message || '删除失败')
		} finally {
			loading.value = false
		}
	}

	// 文件超出个数限制时的钩子
	const exceedFile = (files: File[], fileList: UploadUserFile[]) => {
		ElMessage.warning(
			`只能选择 ${limitNum.value} 个文件，当前共选择了 ${files.length + fileList.length} 个`,
		)
	}
	// 文件状态改变时的钩子
	const fileChange = (file: UploadFile) => {
		const extension = file.name?.split('.').pop()?.toLowerCase()
		if (extension && !['xlsx', 'xls'].includes(extension)) {
			ElMessage.warning('请上传Excel文件（后缀为.xlsx或.xls）')
			return false
		}

		console.log((Number(file.size) / 1024 / 1024).toFixed(2))

		if (file.size && file.size / 1024 / 1024 > 5) {
			ElMessage.warning('文件大小不得超过5M')
			return false
		}
		formData.value.data_file = file.raw
	}
	// 提交上传文件表单
	const submitForm = async () => {
		if (!formData.value.data_name) {
			ElMessage.warning('请输入文件名')
			return
		}
		if (!formData.value.data_file) {
			ElMessage.warning('请选择要上传的文件')
			return
		}

		const loadingInstance = ElLoading.service({
			fullscreen: true,
			text: '正在上传...',
		})

		try {
			await userStore.createDataList(
				formData.value.data_name,
				formData.value.data_file,
			)
			ElMessage.success('上传成功')
			const data = await userStore.getDataList()
			projectList.value = data
			fileList.value = []
			drawer.value = false
			formData.value.data_name = ''
		} catch (error: any) {
			ElMessage.error(error.response.data.message || '上传失败')
		} finally {
			loadingInstance.close()
		}
	}

	onMounted(async () => {
		try {
			loading.value = true
			const data = await userStore.getDataList()
			projectList.value = data
		} catch (error) {
			console.error('获取数据列表失败:', error)
		} finally {
			loading.value = false
		}
	})
</script>

<template>
	<el-container class="MDPP-container">
		<el-header class="MDPP-header">
			<div class="left">
				<span class="iconfont icon-biaoqian"></span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/mydata' }">
						我的数据
					</el-breadcrumb-item>
					<el-breadcrumb-item> 数据列表 </el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-button type="primary" @click="uploadFileClick">
				上传数据文件
			</el-button>
		</el-header>
		<el-main class="MDPP-main">
			<el-container class="MDPP-detail-container">
				<el-table
					class="MDPP-detail-table"
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
					<el-table-column fixed label="数据名称" prop="data_name">
						<template #default="{ row }">
							<span class="iconfont icon-excel"></span>
							{{ row.data_name }}
						</template>
					</el-table-column>
					<el-table-column label="文件大小" prop="file_size" width="300">
						<template #default="{ row }">
							{{ row.file_size.toFixed(2) }} MB
						</template>
					</el-table-column>
					<el-table-column label="更新时间" prop="updated_at" width="300">
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
										<el-dropdown-item @click="handleDownload(row)">
											<el-icon> <Download /> </el-icon>下载
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
			<h4>上传数据文件</h4>
		</template>
		<template #default>
			<div>
				<el-input
					v-model="formData.data_name"
					placeholder="请输入文件名"
					style="margin-bottom: 20px"
				></el-input>
				<el-upload
					class="upload-demo"
					drag
					multiple
					ref="upload"
					:limit="limitNum"
					:auto-upload="false"
					accept=".xlsx,.xls"
					:on-change="fileChange"
					:on-exceed="exceedFile"
					:file-list="fileList"
				>
					<el-icon class="el-icon--upload">
						<UploadFilled />
					</el-icon>
					<div class="el-upload__text">拖拽文件到此处 或 <em>点击上传</em></div>
					<template #tip>
						<div class="el-upload__tip">只能上传xlsx或xls文件，且不超过5M</div>
					</template>
				</el-upload>
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
	.MDPP-container {
		width: 100%;
		height: 100%;
	}

	.MDPP-header {
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

	.MDPP-main {
		width: 100%;
		height: 100%;
		padding-top: 0;
	}

	.MDPP-detail-container {
		width: 100%;
		height: 100%;
	}

	.MDPP-detail-table {
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

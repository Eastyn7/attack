<template>
	<el-container class="MDPP-container">
		<el-header class="MDPP-header">
			<div class="left">
				<span class="iconfont icon-biaoqian"></span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/mydata' }">
						我的数据
					</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/mydata/project' }">
						数据列表
					</el-breadcrumb-item>
					<el-breadcrumb-item>
						数据：{{ receivedProjectName }}
					</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main class="MDPP-main">
			<el-container class="MDPP-detail-container">
				<el-auto-resizer>
					<template #default="{ height, width }">
						<el-table-v2
							:columns="columns"
							:data="formattedTableData"
							v-loading="loading"
							:width="width"
							:height="height"
							fixed
						/>
					</template>
				</el-auto-resizer>
			</el-container>
		</el-main>
	</el-container>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import * as XLSX from 'xlsx'
	import { useUserStore } from '@/stores'

	const userStore = useUserStore()
	const loading = ref(false)

	// 声明 Excel 文件路径
	const excelFilePath = ref('')

	// 路由相关
	const route = useRoute()
	const receivedProjectName = ref<string>('')

	// 定义表格数据、表头和格式化数据
	const tableData = ref<(string | number)[][]>([]) // 二维数组，存储表格原始数据
	const headers = ref<string[]>([]) // 存储表头
	const formattedTableData = ref<Record<string, string | number>[]>([]) // 格式化后的数据，存储为对象数组
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const columns = ref<any[]>([]) // 存储 el-table-v2 的列配置

	// 加载Excel文件并解析
	const loadExcelData = async (url: string): Promise<void> => {
		try {
			const response = await fetch(url)
			const data = await response.arrayBuffer()

			const workbook = XLSX.read(data, { type: 'array' })
			const sheet = workbook.Sheets[workbook.SheetNames[0]] // 读取第一个工作表

			// 将工作表转换为二维数组
			tableData.value = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (
				| string
				| number
			)[][]

			// 提取表头
			headers.value = tableData.value[0] as string[]

			// 将二维数组转换为对象数组
			formattedTableData.value = tableData.value.slice(1).map((row) => {
				const rowObj: Record<string, string | number> = {}
				headers.value.forEach((header, index) => {
					rowObj[header] = row[index]
				})
				return rowObj
			})

			// 生成 el-table-v2 的列配置
			columns.value = headers.value.map((header) => ({
				key: header,
				dataKey: header,
				title: header,
				width: 210,
				resizable: true,
			}))
		} catch (error) {
			console.error('加载Excel文件出错:', error)
		}
	}

	// 在页面加载时获取路由参数并赋值给响应式数据
	onMounted(async () => {
		receivedProjectName.value = route.query.data_name as string
		try {
			loading.value = true
			// 等待异步方法返回结果
			excelFilePath.value = await userStore.getFilePath(
				receivedProjectName.value,
			)
		} catch (error) {
			console.error('获取文件路径出错:', error)
		} finally {
			loading.value = false
		}
		// 传入 excelFilePath.value 而不是 excelFilePath
		await loadExcelData(excelFilePath.value)
	})
</script>

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
	}

	.MDPP-header .left {
		display: flex;
		align-items: center;
	}

	.MDPP-header .iconfont {
		font-size: 20px;
		margin-right: 5px;
	}

	.MDPP-main {
		width: 100%;
		height: 100%;
		padding-top: 0;
	}

	.MDPP-detail-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

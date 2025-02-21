<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import * as XLSX from 'xlsx'
	import { useUserStore } from '@/stores'
	import * as echarts from 'echarts'

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
	// 统计数据
	const statistics = ref<Record<string, any>>({})
	const statisticsArray = ref<any[]>([]) // 存储统计数据的数组

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

			// 计算每列的统计数据
			calculateStatistics()
			// 绘制图表
			drawChart()
		} catch (error) {
			console.error('加载Excel文件出错:', error)
		}
	}

	// 计算每列的最大值、最小值、平均值、方差
	const calculateStatistics = (): void => {
		const stats: Record<string, any> = {}

		headers.value.forEach((header) => {
			const columnData = formattedTableData.value.map((row) => row[header])
			const numericData = columnData.filter(
				(value) => typeof value === 'number',
			) as number[]

			if (numericData.length > 0) {
				const max = Math.max(...numericData).toFixed(4) // 保留四位小数
				const min = Math.min(...numericData).toFixed(4) // 保留四位小数
				const mean = (
					numericData.reduce((sum, value) => sum + value, 0) /
					numericData.length
				).toFixed(8) // 保留八位小数
				const variance = (
					numericData.reduce(
						(sum, value) => sum + Math.pow(value - parseFloat(mean), 2),
						0,
					) / numericData.length
				).toFixed(8) // 保留八位小数

				stats[header] = {
					max, // 直接使用字符串形式的保留四位小数
					min, // 直接使用字符串形式的保留四位小数
					mean, // 直接使用字符串形式的保留八位小数
					variance, // 直接使用字符串形式的保留八位小数
					distribution: numericData.sort((a, b) => a - b),
				}
			}
		})

		statistics.value = stats
		// 将统计数据转换为数组
		statisticsArray.value = Object.keys(stats).map((key) => ({
			header: key,
			...stats[key],
		}))
	}

	// 绘制图表的函数
	const drawChart = (): void => {
		// 获取表头信息，作为不同数据组的标识
		const headersData: string[] = headers.value
		// 提取每列的数值数据
		const columnsData: number[][] = headersData.map((header: string) => {
			return formattedTableData.value
				.map((row: Record<string, string | number>) => row[header])
				.filter(
					(value: string | number): value is number =>
						typeof value === 'number',
				)
		})

		// 存储所有数据点的坐标
		const allDataPoints: [string, number][] = []
		// 存储 x 轴的类别数据
		const xAxisCategories: string[] = []

		// 遍历每列数据
		columnsData.forEach((columnData: number[], colIndex: number) => {
			const columnName = headersData[colIndex]
			columnData.forEach((value: number, rowIndex: number) => {
				const category = `${columnName}-${rowIndex + 1}`
				xAxisCategories.push(category)
				allDataPoints.push([category, value])
			})
		})

		// 获取用于渲染图表的 DOM 元素
		const chartDom: HTMLDivElement = document.getElementById(
			'echart',
		) as HTMLDivElement
		// 初始化 ECharts 实例
		const myChart: echarts.ECharts = echarts.init(chartDom)

		// 配置 ECharts 选项
		const option: echarts.EChartsOption = {
			// 提示框配置，鼠标悬停显示信息
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			// 网格布局配置
			grid: {
				bottom: 120,
			},
			// x 轴配置
			xAxis: {
				type: 'category',
				data: xAxisCategories,
				axisLabel: {
					// 控制标签显示间隔，避免标签过多重叠
					interval: function (index) {
						const colLength = columnsData[0].length
						// 只显示每列最后一个数据的标签
						return (index + 1) % colLength === 0
					},
					rotate: 20, // 旋转标签，防止重叠
					formatter: function (value) {
						return value.split('-')[0] // 只显示列名
					},
				},
			},
			// y 轴配置
			yAxis: {
				type: 'value',
			},
			// 系列配置，使用散点图展示数据
			series: [
				{
					type: 'scatter',
					data: allDataPoints,
					symbolSize: 3,
					large: true,
				},
			],
			// 图例配置
			legend: {
				data: ['数据分布'],
			},
			// 数据缩放配置
			dataZoom: [
				{
					type: 'inside',
				},
				{
					type: 'slider',
				},
			],
		}

		// 应用配置到 ECharts 实例
		myChart.setOption(option)
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
			<!-- 这里放具体的数据 -->
			<el-container class="MDPP-detail-container">
				<el-header>文件详情</el-header>
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

			<!-- 这里放计算的值 -->
			<el-container
				class="MDPP-detail-container MDPP-detail-calculate-container"
			>
				<el-header> 数据情况 </el-header>
				<el-table
					table-layout="auto"
					:data="statisticsArray"
					style="width: 90%"
					fixed
				>
					<el-table-column label="列名" align="left">
						<template #default="scope">
							{{ scope.row.header }}
						</template>
					</el-table-column>
					<el-table-column label="最大值" align="right">
						<template #default="scope">
							{{ scope.row.max }}
						</template>
					</el-table-column>
					<el-table-column label="最小值" align="right">
						<template #default="scope">
							{{ scope.row.min }}
						</template>
					</el-table-column>
					<el-table-column label="平均值" align="right">
						<template #default="scope">
							{{ scope.row.mean }}
						</template>
					</el-table-column>
					<el-table-column label="方差" align="right">
						<template #default="scope">
							{{ scope.row.variance }}
						</template>
					</el-table-column>
				</el-table>
			</el-container>

			<!-- 这里放绘制的图 -->
			<el-container class="MDPP-detail-container">
				<el-header> 数据分布情况 </el-header>
				<div id="echart" style="width: 100%; height: 100%"></div>
			</el-container>
		</el-main>
	</el-container>
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

		.el-header {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30px;
			font-weight: bold;
			letter-spacing: 5px;
			color: #1989fa;
			background-color: #7b7b7b16;
			margin: 0;
			padding: 0;
		}
	}

	.MDPP-detail-calculate-container {
		margin: 50px 0;
	}
</style>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { UploadFilled } from '@element-plus/icons-vue'
	import { useRoute } from 'vue-router'
	import { useUserStore } from '@/stores'
	import api from '@/api/index'
	import * as XLSX from 'xlsx'

	const loading = ref(false)
	const isResult = ref(false)

	const route = useRoute()
	const userStore = useUserStore()
	const receivedProjectName = ref('')
	const receiveDataName = ref('')
	const modelName = ref('')
	const excelFilePath = ref('')
	const dataHeaders = ref<string[]>([])
	const auditOptions = ref<any[]>([])
	const method = ref('')
	const maxUploadLimit = ref(1)
	const modelFileList = ref([])

	const processItems = ref([
		{
			title: '数据集',
			iconClass: 'iconfont icon-shujuji',
			description: '数据集文件名称及链接',
		},
		{
			title: '训练模型',
			iconClass: 'iconfont icon-shujumoxing',
			description: '训练模型文件名称',
		},
		{
			title: '审计方法',
			iconClass: 'iconfont icon-fenxipeizhi',
			description: '您选用的审计方法：对应审计方法名称',
		},
		{
			title: '分析结果',
			iconClass: 'iconfont icon-fenxijieguo',
			description:
				'以下是对您的数据集（数据集文件名称）及训练模型（模型文件名称）根据（对应审计方法）审计方法得到的结果',
		},
	])

	const option1 = {
		// legend: {
		// 	data: ['Allocated Budget', 'Actual Spending'],
		// },
		radar: {
			indicator: [
				{ name: 'Sales', max: 6500 },
				{ name: 'Administration', max: 16000 },
				{ name: 'Information Technology', max: 30000 },
				{ name: 'Customer Support', max: 38000 },
				{ name: 'Development', max: 52000 },
				{ name: 'Marketing', max: 25000 },
			],
		},
		series: [
			{
				name: 'Budget vs spending',
				type: 'radar',
				data: [
					{
						value: [4200, 3000, 20000, 35000, 50000, 18000],
						name: 'Allocated Budget',
					},
					{
						value: [5000, 14000, 28000, 26000, 42000, 21000],
						name: 'Actual Spending',
					},
				],
			},
		],
	}

	const option2 = {
		tooltip: {
			trigger: 'item',
		},
		visualMap: {
			show: false,
			min: 80,
			max: 600,
			inRange: {
				colorLightness: [0, 1],
			},
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: '55%',
				center: ['50%', '50%'],
				data: [
					{ value: 335, name: 'Direct' },
					{ value: 310, name: 'Email' },
					{ value: 274, name: 'Union Ads' },
					{ value: 235, name: 'Video Ads' },
					{ value: 400, name: 'Search Engine' },
				].sort(function (a, b) {
					return a.value - b.value
				}),
				roseType: 'radius',
				label: {
					// color: 'rgba(255, 255, 255, 0.3)',
				},
				labelLine: {
					lineStyle: {
						// color: 'rgba(255, 255, 255, 0.3)',
					},
					smooth: 0.2,
					length: 10,
					length2: 20,
				},
				itemStyle: {
					color: '#c23531',
					// shadowBlur: 200,
					// shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
				animationType: 'scale',
				animationEasing: 'elasticOut',
				animationDelay: function () {
					return Math.random() * 200
				},
			},
		],
	}

	// 获取数据文件中的表头
	const loadExcelData = async (url: string): Promise<void> => {
		try {
			const response = await fetch(url)
			const data = await response.arrayBuffer()

			const workbook = XLSX.read(data, { type: 'array' })
			const sheet = workbook.Sheets[workbook.SheetNames[0]] // 读取第一个工作表

			// 初始化表头数组
			const headerArray: string[] = []

			// 获取表头范围
			const range = XLSX.utils.decode_range(sheet['!ref'] as string)

			// 遍历第一行的单元格
			for (let col = range.s.c; col <= range.e.c; col++) {
				const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col })
				const cell = sheet[cellAddress]
				if (cell) {
					headerArray.push(cell.v.toString())
				} else {
					headerArray.push('')
				}
			}

			// 将表头数据赋值给响应式变量
			dataHeaders.value = headerArray
		} catch (error) {
			console.error('加载Excel文件出错:', error)
		}
	}

	// 文件超出个数限制时的钩子
	const exceedFileLimit = (newFiles: any, currentFileList: any) => {
		ElMessage.warning(
			`只能选择 ${maxUploadLimit.value} 个文件，当前共选择了 ${newFiles.length + currentFileList.length} 个`,
		)
	}
	// 处理训练模型文件上传
	const handleModelChange = (file: any, fileList: any) => {
		modelName.value = file.name // 更新模型名称
		fileList.splice(0, fileList.length, file.raw) // 更新文件列表
	}
	// 取消选择的模型
	const cancelUpload = (listName: any) => {
		if (listName === modelFileList.value) {
			modelFileList.value = []
		}
	}
	// 上传模型文件
	const uploadModelFile = async () => {
		if (modelFileList.value.length === 0) {
			ElMessage.warning('请上传训练模型文件')
			return
		}

		try {
			const file = modelFileList.value[0]
			console.log('模型文件:', file)

			// 这里是数据处理的过程
			// 这里是数据处理的过程
			// 这里是数据处理的过程

			ElMessage.success('训练模型上传成功')
		} catch (error: any) {
			ElMessage.error(error.response.data.message || '上传失败，请重试')
		}
	}

	// 开始分析
	const startAnalyse = async () => {
		if (modelFileList.value.length === 0 || !method.value) {
			ElMessage.warning('请上传训练模型文件并选择审计方法')
			return
		}

		// 先将loading设置为true
		loading.value = true

		// 更新分析流程中的描述
		processItems.value.forEach((item) => {
			if (item.title === '数据集') {
				item.description = `${receiveDataName.value}`
			}
			if (item.title === '训练模型') {
				item.description = `${modelName.value}` // 这里只是示例，取第一个模型文件的名称
			}
			if (item.title === '审计方法') {
				item.description = `您选用的审计方法：${auditOptions.value.find((option) => option.value === method.value).label}`
			}
			if (item.title === '分析结果') {
				item.description = `以下是对您的数据集（${receiveDataName.value}）及训练模型（${modelName.value}）根据${auditOptions.value.find((option) => option.value === method.value).label}审计方法得到的结果`
			}
		})

		// 使用定时器，等待5秒
		await new Promise((resolve) => {
			setTimeout(() => {
				// 5秒后将loading改为false
				loading.value = false
				// 同时将isResult设置为true
				isResult.value = true
				resolve(true)
			}, 5000)
		})
	}

	// 在页面加载时获取路由参数并赋值给响应式数据
	onMounted(async () => {
		receivedProjectName.value = route.query.project_name as string
		receiveDataName.value = route.query.data_name as string
		try {
			excelFilePath.value = await userStore.getFilePath(receiveDataName.value)
			const auditsResponse = await api.audit.getAuditInfoList()
			if (auditsResponse.status) {
				auditOptions.value = auditsResponse.data.auditInfoList.map(
					(item: any) => ({
						value: item.audit_id,
						label: item.audit_name,
					}),
				)
			}
		} catch (error) {
			console.error('获取文件路径失败:', error)
		}
		// 获取表头
		await loadExcelData(excelFilePath.value)
	})
</script>

<template>
	<el-container class="ADP-container">
		<el-header class="ADP-header">
			<div class="left">
				<span class="iconfont icon-biaoqian"></span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/analyse' }">
						数据分析
					</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/analyse/project' }">
						分析项目
					</el-breadcrumb-item>
					<el-breadcrumb-item>
						项目：{{ receivedProjectName }}
					</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main class="ADP-main">
			<el-container class="ADP-detail-container">
				<el-aside class="aside-data">
					<page-container title="选用数据集" class="aside-data-details">
						<el-descriptions
							class="data-descriptions"
							:column="1"
							size="small"
							border
						>
							<el-descriptions-item>
								<template #label>
									<div class="cell-item">数据集名称</div>
								</template>
								{{ receiveDataName }}
							</el-descriptions-item>
							<el-descriptions-item
								v-for="(header, index) in dataHeaders"
								:key="index"
							>
								<template #label>
									<div class="cell-item">参数名 {{ index + 1 }}</div>
								</template>
								{{ header }}
							</el-descriptions-item>
						</el-descriptions>
						<el-divider content-position="left">
							前往
							<router-link
								to="/mydata"
								style="text-decoration: none; color: #409eff"
							>
								上传新数据
							</router-link>
						</el-divider>
					</page-container>
				</el-aside>
				<el-aside>
					<page-container title="选用训练模型">
						<el-upload
							drag
							multiple
							:limit="maxUploadLimit"
							:auto-upload="false"
							:on-change="handleModelChange"
							:on-exceed="exceedFileLimit"
							v-model:file-list="modelFileList"
							:accept="'.onnx'"
						>
							<el-icon class="el-icon--upload">
								<UploadFilled />
							</el-icon>
							<div class="el-upload__text">
								拖拽文件到此处 或 <em>点击上传</em>
							</div>
							<template #tip>
								<div class="el-upload__tip">支持.onnx文件类型</div>
							</template>
						</el-upload>
						<br />
						<el-button size="small" type="primary" @click="uploadModelFile">
							上传模型文件
						</el-button>
						<el-button size="small" @click="cancelUpload(modelFileList)">
							取消
						</el-button>
					</page-container>
				</el-aside>
				<el-container class="result-container">
					<el-header class="result-header">
						<div class="methods">
							选择审计方法：
							<el-radio-group v-model="method" size="large">
								<el-radio-button
									v-for="(audit, index) in auditOptions"
									:key="index"
									:label="audit.label"
									:value="audit.value"
								/>
							</el-radio-group>
						</div>
						<el-button size="large" type="primary" @click="startAnalyse"
							>开始分析</el-button
						>
					</el-header>
					<el-main class="result-main">
						<page-container
							class="result-main-details"
							title="分析结果"
							v-loading="loading"
						>
							<template #extra>
								<el-button type="primary" plain>导出为PDF</el-button>
								<el-button type="primary" plain>分享</el-button>
							</template>
							<el-empty v-if="!isResult"></el-empty>
							<div v-else class="result-details-container">
								<!-- 分析流程 -->
								<div class="fenxiliucheng">
									<el-text class="process-title" size="large">
										分析流程
									</el-text>
									<el-steps
										class="result-details-process"
										:active="4"
										direction="vertical"
									>
										<el-step
											v-for="item in processItems"
											:key="item.title"
											:title="item.title"
										>
											<template #icon>
												<span :class="item.iconClass"></span>
											</template>
											<template #description>
												<el-link v-if="item.description">{{
													item.description
												}}</el-link>
											</template>
										</el-step>
									</el-steps>
								</div>
								<!-- 分析步骤 -->
								<div class="fenxibuzhou">
									<el-text class="process-title" size="large">
										分析步骤
									</el-text>
									<el-text class="process-content">
										1. 初步检查数据中是否存在缺失值、异常值或不一致的情况。
									</el-text>
									<el-text class="process-content">
										2.
										揭示数据的分布、范围和变化情况，从而帮助选择适合的分析方法。
									</el-text>
								</div>
								<!-- 详细结论 -->
								<div class="xiangxijielun">
									<el-text class="process-title" size="large">
										详细结论
									</el-text>
									<div class="result-chart-container">
										<div style="height: 300px; width: 400px">
											<e-charts class="chart" :option="option1" />
										</div>
										<div style="height: 300px; width: 400px">
											<e-charts class="chart" :option="option2" />
										</div>
									</div>
								</div>
								<!-- 分析建议 -->
								<div class="fenxijianyi">
									<el-text class="process-title" size="large">
										分析建议
									</el-text>
									<el-text class="process-content">
										1. 初步检查数据中是否存在缺失值、异常值或不一致的情况。
									</el-text>
									<el-text class="process-content">
										2.
										揭示数据的分布、范围和变化情况，从而帮助选择适合的分析方法。
									</el-text>
								</div>
							</div>
						</page-container>
					</el-main>
				</el-container>
			</el-container>
		</el-main>
	</el-container>
</template>

<style scoped>
	.ADP-container {
		width: 100%;
		height: 100%;
	}

	.ADP-header {
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

	.ADP-main {
		width: 100%;
		height: 100%;
		padding-top: 0;
	}

	.aside-data {
		padding: 0;
	}

	.cell-item {
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: start;
	}

	.ADP-detail-container {
		width: 100%;
		height: 100%;
	}

	.result-container {
		width: 100%;
		height: 100%;
	}

	.result-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.methods {
		display: flex;
		align-items: center;
	}

	.result-main {
		width: 100%;
		height: 100%;
	}

	.result-main-details {
		padding: 0;
		/* position: relative; */
	}

	.result-details-container {
		padding: 0;

		.result-details-process {
			width: 100%;
			height: 280px;
			padding: 0px 20px;

			.iconfont {
				font-size: 20px;
			}
		}

		.process-title {
			font-size: 21px;
			font-weight: bold;
			padding-left: 10px;
			border-left: 10px solid #1989fa;
			display: block;
			margin: 0px 0 20px 0;
		}

		.process-content {
			display: block;
			padding: 0 20px;
		}

		.result-chart-container {
			/* height: 400px; */
			margin: 20px 0 20px 0;
			display: flex;
		}

		.fenxiliucheng {
			margin-bottom: 40px;
		}

		.fenxibuzhou {
			margin-bottom: 40px;
		}

		.xiangxijielun {
			margin-bottom: 40px;
		}

		.fenxijianyi {
			margin-bottom: 40px;
		}
	}
</style>

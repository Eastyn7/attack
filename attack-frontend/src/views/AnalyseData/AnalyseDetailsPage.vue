<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { UploadFilled } from '@element-plus/icons-vue'
	import { useRoute } from 'vue-router'
	import * as XLSX from 'xlsx'

	const loading = ref(false)
	const isResult = ref(false)

	const route = useRoute()
	const receivedProjectName = ref('')

	const processItems = ref([
		{
			title: '数据集',
			iconClass: 'iconfont icon-shujuji',
			description: '数据集文件链接',
		},
		{
			title: '训练模型',
			iconClass: 'iconfont icon-shujumoxing',
			description: '训练模型文件链接',
		},
		{
			title: '审计方法',
			iconClass: 'iconfont icon-fenxipeizhi',
			description: '您选用的审计方法：1',
		},
		{
			title: '分析结果',
			iconClass: 'iconfont icon-fenxijieguo',
			description: '以下是对您的数据集及训练模型根据（）审计方法得到的结果',
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

	const method = ref('1')
	const maxUploadLimit = ref(1)
	const excelFileList = ref([]) // Excel 文件列表
	const modelFileList = ref([]) // 模型文件列表

	// 文件超出个数限制时的钩子
	const exceedFileLimit = (newFiles: any, currentFileList: any) => {
		ElMessage.warning(
			`只能选择 ${maxUploadLimit.value} 个文件，当前共选择了 ${newFiles.length + currentFileList.length} 个`,
		)
	}

	// 处理 Excel 文件上传
	const handleExcelChange = (file: any, fileList: any) => {
		const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
		const fileSize = file.size / 1024 / 1024

		if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
			ElMessage.warning('请上传Excel文件（后缀为.xlsx或.xls）')
			return
		}
		if (fileSize > 5) {
			ElMessage.warning('文件大小不得超过5M')
			return
		}
		fileList.splice(0, fileList.length, file.raw) // 更新文件列表
	}

	// 处理训练模型文件上传（支持任意文件类型）
	const handleModelChange = (file: any, fileList: any) => {
		const fileSize = file.size / 1024 / 1024
		if (fileSize > 10) {
			// 设置最大10MB限制
			ElMessage.warning('文件大小不得超过10M')
			return
		}
		fileList.splice(0, fileList.length, file.raw) // 更新文件列表
	}

	// 上传 Excel 文件
	const uploadExcelFile = async () => {
		if (excelFileList.value.length === 0) {
			ElMessage.warning('请上传数据集文件')
			return
		}

		try {
			const file = excelFileList.value[0]
			const reader = new FileReader()

			reader.onload = async (e) => {
				const data = e.target?.result
				const workbook = XLSX.read(data, { type: 'array' })
				const sheetName = workbook.SheetNames[0]
				const sheet = workbook.Sheets[sheetName]
				const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

				jsonData.shift() // 移除标题行
				console.log('Excel 数据:', jsonData)

				// 这里是数据处理的过程
				// 这里是数据处理的过程
				// 这里是数据处理的过程

				ElMessage.success('数据集上传成功')
			}
			reader.readAsArrayBuffer(file)
		} catch (error: any) {
			ElMessage.error(error.response.data.message || '上传失败，请重试')
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

	// 取消选择的数据集或模型
	const cancelUpload = (listName: any) => {
		if (listName === excelFileList.value) {
			excelFileList.value = []
		}
		if (listName === modelFileList.value) {
			modelFileList.value = []
		}
	}

	// 开始分析
	const startAnalyse = async () => {
		if (
			excelFileList.value.length === 0 ||
			modelFileList.value.length === 0 ||
			!method.value
		) {
			ElMessage.warning('请上传数据集文件和训练模型文件并选择审计方法')
			return
		}
		// 先将loading设置为true
		loading.value = true
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
	onMounted(() => {
		receivedProjectName.value = route.query.projectName as string
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
				<el-aside>
					<page-container title="上传数据集">
						<el-upload
							class="upload-demo"
							drag
							multiple
							:limit="maxUploadLimit"
							:auto-upload="false"
							accept=".xlsx,.xls"
							:on-change="handleExcelChange"
							:on-exceed="exceedFileLimit"
							v-model:file-list="excelFileList"
						>
							<el-icon class="el-icon--upload">
								<UploadFilled />
							</el-icon>
							<div class="el-upload__text">
								拖拽文件到此处 或 <em>点击上传</em>
							</div>
							<template #tip>
								<div class="el-upload__tip">
									只能上传.xlsx或.xls文件，且大小不超过5MB
								</div>
							</template>
						</el-upload>
						<br />
						<el-button size="small" type="primary" @click="uploadExcelFile">
							上传数据集
						</el-button>
						<el-button size="small" @click="cancelUpload(excelFileList)">
							取消
						</el-button>
					</page-container>
				</el-aside>
				<el-aside>
					<page-container title="上传训练模型">
						<el-upload
							drag
							multiple
							:limit="maxUploadLimit"
							:auto-upload="false"
							:on-change="handleModelChange"
							:on-exceed="exceedFileLimit"
							v-model:file-list="modelFileList"
						>
							<el-icon class="el-icon--upload">
								<UploadFilled />
							</el-icon>
							<div class="el-upload__text">
								拖拽文件到此处 或 <em>点击上传</em>
							</div>
							<template #tip>
								<div class="el-upload__tip">
									支持任何文件类型，大小不超过10MB
								</div>
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
								<el-radio-button label="1" value="1" />
								<el-radio-button label="2" value="2" />
								<el-radio-button label="3" value="3" />
								<el-radio-button label="4" value="4" />
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
							<el-container class="result-details-container" v-else>
								<el-main class="result-details-main">
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
											<div style="height: 300px; width: 500px">
												<e-charts class="chart" :option="option1" />
											</div>
											<div style="height: 300px; width: 500px">
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
								</el-main>
							</el-container>
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
		width: 100%;
		height: 100%;
		padding: 0;
		position: relative;
	}

	.result-details-container {
		width: 95%;
		height: 80%;
		padding: 0;
		position: absolute;

		.result-details-main {
			width: 100%;
			height: 100%;
			padding: 0;
			overflow: auto;
		}

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

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { UploadFilled } from '@element-plus/icons-vue'
	import type { UploadFile, UploadRawFile, UploadUserFile } from 'element-plus'
	import { useRoute } from 'vue-router'
	import { useUserStore } from '@/stores'
	import api from '@/api/index'
	import * as XLSX from 'xlsx'
	import MarkdownIt from 'markdown-it'
	import { formToJson } from '@/utils/formToJson'

	interface FormData {
		model_name: string
		file_type: string
		model_file?: UploadRawFile
	}
	type StepType = 'primary' | 'success' | 'warning' | 'info' | 'danger'
	interface AnalyseResult {
		[key: string]: number | string | undefined // 允许任意字符串键，值为数字/字符串/undefined
	}

	const loading = ref(false)
	const wholeLoading = ref(false)
	const dataLoading = ref(false)
	const isResult = ref(false)
	const isFullScreen = ref(false)

	const toggleFullScreen = () => {
		isFullScreen.value = !isFullScreen.value
	}

	const route = useRoute()
	const userStore = useUserStore()
	const md = new MarkdownIt()
	const receivedProjectName = ref('')
	const receiveDataName = ref('')
	const projectId = ref()
	const modelName = ref('')
	const modelPath = ref('')
	const excelFilePath = ref('')
	const dataHeaders = ref<string[]>([])
	const auditOptions = ref<any[]>([])
	const method = ref('')
	const limitNum = ref(1)
	const fileList = ref<any[]>([])
	const formData = ref<FormData>({
		model_name: '',
		file_type: 'onnx',
	})
	const analyseResult = ref<AnalyseResult>({})
	const aiResult = ref()

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

	const analysisSteps = ref<
		{
			step: string
			type: StepType
			title: string
			description: string
		}[]
	>([
		{
			step: '01',
			type: 'primary',
			title: '接收原始数据集',
			description: '接收用户提供的原始数据，作为后续分析的基础。',
		},
		{
			step: '02',
			type: 'primary',
			title: '预训练处理',
			description: '使用论文中的 TabDDPM 方法对数据集进行预处理。',
		},
		{
			step: '03',
			type: 'primary',
			title: '上传数据集',
			description: '将预处理后的数据集上传至平台。',
		},
		{
			step: '04',
			type: 'primary',
			title: '模型训练',
			description: '默认使用随机森林模型进行训练。',
		},
		{
			step: '05',
			type: 'primary',
			title: '攻击方式选择',
			description: '使用选择的规则对模型进行攻击测试。',
		},
		{
			step: '06',
			type: 'success',
			title: '生成分析结果',
			description: '整合所有分析流程，输出最终结果。',
		},
	])

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
	const exceedFile = (files: File[], fileList: UploadUserFile[]) => {
		ElMessage.warning(
			`只能选择 ${limitNum.value} 个文件，当前共选择了 ${files.length + fileList.length} 个`,
		)
	}
	// 文件状态改变时的钩子
	const fileChange = (file: UploadFile) => {
		const extension = file.name?.split('.').pop()?.toLowerCase()
		if (!extension || !['onnx', 'pkl'].includes(extension)) {
			ElMessage.warning('请上传正确格式的文件（后缀为.onnx,.pkl）')
			return false
		}

		if (file.size && file.size / 1024 / 1024 > 100) {
			ElMessage.warning('文件大小不得超过100M')
			return false
		}
		fileList.value.splice(0, fileList.value.length, file.raw)
		formData.value.model_name = file.name.split('.')[0]
		formData.value.file_type = extension
		formData.value.model_file = file.raw
	}
	// 取消选择的模型
	const cancelUpload = (listName: any) => {
		if (listName === fileList.value) {
			fileList.value = []
			modelName.value = ''
		}
	}
	// 上传模型文件
	const uploadModelFile = async () => {
		if (!formData.value.model_file) {
			ElMessage.warning('请选择要上传的文件')
			return
		}

		try {
			wholeLoading.value = true
			const result = await userStore.uploadModelFile(
				formData.value.model_name,
				formData.value.file_type,
				formData.value.model_file,
			)
			modelPath.value = result.file_path
			modelName.value = result.model_name
			ElMessage.success('训练模型上传成功')
		} catch (error: any) {
			ElMessage.error(error.response.data.message || '上传失败，请重试')
		} finally {
			wholeLoading.value = false
		}
	}

	// 开始分析
	const startAnalyse = async () => {
		if (!modelPath.value || !modelName.value || !method.value) {
			ElMessage.warning('请上传训练模型文件并选择审计方法')
			// return
		}

		// 先将loading设置为true
		loading.value = true

		// 更新分析流程中的描述
		processItems.value.forEach((item) => {
			if (item.title === '数据集') {
				item.description = `${receiveDataName.value}`
			}
			if (item.title === '训练模型') {
				item.description = `${modelName.value}`
			}
			if (item.title === '审计方法') {
				item.description = `您选用的审计方法：${auditOptions.value.find((option) => option.value === method.value).label}`
			}
			if (item.title === '分析结果') {
				item.description = `以下是对您的数据集（${receiveDataName.value}）及训练模型（${modelName.value}）根据${auditOptions.value.find((option) => option.value === method.value).label}审计方法得到的结果`
			}
		})

		try {
			const result = await userStore.analyseData(
				projectId.value,
				excelFilePath.value,
				modelPath.value,
				method.value,
			)
			analyseResult.value = result
			aiResult.value = await userStore.callAi(formToJson(result))
			ElMessage.success('分析成功')
			isResult.value = true
		} catch (error: any) {
			ElMessage.error(error.response.data.message || '上传失败，请重试')
		} finally {
			loading.value = false
		}
	}

	// 计算属性，将 Markdown 内容转换为 HTML
	const renderedMarkdown = computed(() => {
		if (!aiResult.value) return ''
		return md.render(aiResult.value)
	})

	// 在页面加载时获取路由参数并赋值给响应式数据
	onMounted(async () => {
		dataLoading.value = true
		receivedProjectName.value = route.query.project_name as string
		receiveDataName.value = route.query.data_name as string
		try {
			excelFilePath.value = await userStore.getFilePath(receiveDataName.value)
			projectId.value = await userStore.getProjectId(receivedProjectName.value)
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
		dataLoading.value = false
	})

	// 指标对象
	const labelMapping = {
		ModelTrainingAccuracy: {
			name: 'ModelTrainingAccuracy模型训练准确率',
			definition: '模型在训练集上的分类准确率，反映对训练数据的拟合能力。',
			normalRange: '通常应大于80%，但需结合测试准确率判断过拟合风险。',
		},
		ModelTestingAccuracy: {
			name: 'ModelTestingAccuracy模型测试准确率',
			definition: '模型在独立测试集上的泛化能力指标。',
			normalRange: '应与训练准确率差异小于5%，否则存在过拟合风险。',
		},
		OverallAttackAccuracy: {
			name: 'OverallAttackAccuracy整体攻击准确率',
			definition: '攻击模型正确分类成员与非成员的总体准确率。',
			normalRange: '理想隐私保护模型应接近50%（随机猜测水平）。',
		},
		MemberAccuracy: {
			name: 'MemberAccuracy成员准确率（TPR）',
			definition: '攻击模型正确识别训练集成员的比例（真正例率）。',
			normalRange: '理想隐私保护模型应接近50%。',
		},
		NonMemberAccuracy: {
			name: 'NonMemberAccuracy非成员准确率（TNR）',
			definition: '攻击模型正确识别非成员的比例（真负例率）。',
			normalRange: '理想隐私保护模型应接近50%。',
		},
		Precision: {
			name: 'Precision攻击精确率',
			definition: '攻击模型预测为"成员"的样本中真实成员占比。',
			normalRange: '应与召回率保持平衡，通常需大于70%。',
		},
		Recall: {
			name: 'Recall攻击召回率',
			definition: '攻击模型正确识别出的真实成员比例，与TPR等价。',
			normalRange: '应与精确率保持平衡，通常需大于70%。',
		},
		AUC: {
			name: 'AUC值',
			definition: 'ROC曲线下面积，综合衡量攻击模型的判别能力。',
			normalRange: '理想隐私保护模型应接近0.5。',
		},
		CustomPrecision: {
			name: 'CustomPrecision自定义精确率',
			definition: '根据特定业务规则定义的精确率指标。',
			normalRange: '需根据业务需求制定基准。',
		},
		CustomRecall: {
			name: 'CustomRecall自定义召回率',
			definition: '根据特定业务规则定义的召回率指标。',
			normalRange: '需根据业务需求制定基准。',
		},
	}

	// 计算表格数据
	const tableData = computed(() => {
		return Object.entries(analyseResult.value).map(([name, value]) => ({
			name: labelMapping[name as keyof typeof labelMapping].name,
			value: typeof value === 'number' ? value.toFixed(4) : value,
			definition: labelMapping[name as keyof typeof labelMapping].definition,
			normalRange: labelMapping[name as keyof typeof labelMapping].normalRange,
		}))
	})

	// 绘制雷达图
	const mainRadarOption = computed(() => {
		const radarKeys = [
			'ModelTrainingAccuracy',
			'ModelTestingAccuracy',
			'OverallAttackAccuracy',
			'MemberAccuracy',
			'NonMemberAccuracy',
			'AUC',
		]
		const indicator = radarKeys.map((key) => ({
			name: labelMapping[key as keyof typeof labelMapping].name,
			max: 1,
		}))
		const values = radarKeys.map((key) => analyseResult.value[key] || 0)

		return {
			radar: {
				indicator,
				shape: 'circle',
				splitNumber: 5,
				axisName: {
					textStyle: {
						color: '#333',
						fontWeight: 'bold',
					},
				},
				splitLine: {
					lineStyle: {
						color: '#ccc',
						type: 'dashed',
					},
				},
				axisLine: {
					lineStyle: {
						color: '#999',
					},
				},
			},
			series: [
				{
					label: {
						show: true,
					},
					name: '模型性能',
					type: 'radar',
					data: [
						{
							value: values,
							name: '当前模型',
							itemStyle: {
								color: '#409eff',
							},
							lineStyle: {
								color: '#409eff',
							},
							areaStyle: {
								opacity: 0.2,
							},
						},
					],
				},
			],
		}
	})

	// 扩展指标面板
	const extendedMetrics = computed(() => {
		const excludedKeys = [
			'ModelTrainingAccuracy',
			'ModelTestingAccuracy',
			'OverallAttackAccuracy',
			'MemberAccuracy',
			'NonMemberAccuracy',
			'AUC',
		]
		return Object.entries(analyseResult.value)
			.filter(([key]) => !excludedKeys.includes(key))
			.map(([key, value]) => {
				const mapping = labelMapping[key as keyof typeof labelMapping]
				return {
					name: mapping?.name || key,
					value:
						typeof value === 'number' ? (value * 100).toFixed(2) + '%' : value,
				}
			})
	})
</script>

<template>
	<el-container class="ADP-container" v-loading="wholeLoading">
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
					<page-container
						v-loading="dataLoading"
						title="选用数据集"
						class="aside-data-details"
					>
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
							:limit="limitNum"
							:auto-upload="false"
							:on-change="fileChange"
							:on-exceed="exceedFile"
							:file-list="fileList"
							:accept="'.onnx, .pkl'"
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
						<el-button size="small" @click="cancelUpload(fileList)">
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
					<el-main
						class="result-main"
						:class="{ 'fullscreen-mode': isFullScreen }"
					>
						<page-container
							class="result-main-details"
							title="分析结果"
							v-loading="loading"
						>
							<template #extra>
								<el-button type="primary" plain>导出为PDF</el-button>
								<el-button type="primary" plain @click="toggleFullScreen">
									{{ isFullScreen ? '放小查看' : '放大查看' }}
								</el-button>
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
									<el-text class="process-title" size="large">分析步骤</el-text>
									<div
										class="process-content content"
										v-for="item in analysisSteps"
										:key="item.step"
									>
										<el-tag :type="item.type" effect="dark">
											{{ item.step }}
										</el-tag>
										{{ item.title }}
										<el-text>
											{{ item.description }}
										</el-text>
									</div>
								</div>
								<!-- 详细结果 -->
								<div class="xiangxijieguo">
									<el-text class="process-title" size="large">
										详细结果
									</el-text>
									<el-table :data="tableData" style="width: 100%">
										<el-table-column
											prop="name"
											label="指标名称"
											width="170"
										></el-table-column>
										<el-table-column
											prop="definition"
											label="定义"
											width="200"
										></el-table-column>
										<el-table-column label="正常范围">
											<template #default="scope">
												<el-tag type="success">{{
													scope.row.normalRange
												}}</el-tag>
											</template>
										</el-table-column>
										<el-table-column
											prop="value"
											label="您的指标值"
											width="100"
										></el-table-column>
									</el-table>

									<div class="combined-charts">
										<!-- 主雷达图 -->
										<div class="main-radar" style="height: 400px">
											<e-charts :option="mainRadarOption" />
										</div>

										<!-- 扩展指标面板 -->
										<div class="metric-panel">
											<el-row :gutter="20">
												<el-col
													:span="6"
													v-for="(item, index) in extendedMetrics"
													:key="index"
												>
													<el-card class="metric-panel-card">
														<div class="metric-name">{{ item.name }}</div>
														<div class="metric-value">{{ item.value }}</div>
													</el-card>
												</el-col>
											</el-row>
										</div>
									</div>

									<!-- <div style="height: 300px; width: 400px">
										<e-charts class="chart" :option="radarOption" />
									</div>

									<div class="result-chart-container">
										<div style="height: 300px; width: 400px">
											<e-charts class="chart" :option="option1" />
										</div>
										<div style="height: 300px; width: 400px">
											<e-charts class="chart" :option="option2" />
										</div>
									</div> -->
								</div>
								<!-- 分析建议 -->
								<div class="fenxijianyi">
									<el-text class="process-title" size="large">
										分析建议
									</el-text>
									<div v-html="renderedMarkdown" class="markdown-content"></div>
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
	.fullscreen-mode {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgb(255, 255, 255);
		z-index: 9999;
		overflow: auto;
		padding: 20px;
	}

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

			.content {
				margin: 0 0 10px 0;
			}
		}

		.xiangxijieguo {
			margin-bottom: 40px;
		}

		.fenxijianyi {
			margin-bottom: 40px;
		}
	}

	.combined-charts {
		display: flex;
		flex-direction: column;
		gap: 20px;

		.main-radar {
			margin-top: 20px;
			border: 1px solid #e4e7ed;
			border-radius: 8px;
			display: flex;
			justify-content: center;
			align-items: center;

			.echarts {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.metric-panel {
			.metric-panel-card {
				height: 120px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.metric-name {
					font-size: 14px;
					color: #666;
					display: flex;
					justify-content: center;
				}

				.metric-value {
					font-size: 24px;
					font-weight: bold;
					color: #409eff;
					display: flex;
					justify-content: center;
				}
			}
		}
	}
</style>

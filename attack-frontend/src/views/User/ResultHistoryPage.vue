<script setup lang="ts">
	import { useUserStore } from '@/stores'
	import { ElMessage } from 'element-plus'

	const userStore = useUserStore()
	const resultList = ref([])
	const loading = ref(false)

	const fetchResultHistory = async () => {
		loading.value = true
		try {
			const data = await userStore.getResultHistory()
			if (data) {
				resultList.value = data
			} else {
				resultList.value = []
				ElMessage.info('暂无历史数据')
			}
		} catch (error) {
			ElMessage.error('获取数据失败')
			console.error(error)
		} finally {
			loading.value = false
		}
	}

	onMounted(fetchResultHistory)
</script>

<template>
	<div class="RHP-layout">
		<el-container class="RHP-container">
			<el-main class="RHP-main">
				<page-container title="审计历史记录">
					<el-table :data="resultList" v-loading="loading" height="380">
						<el-table-column
							fixed
							label="项目ID"
							prop="project_id"
							width="70"
						></el-table-column>
						<el-table-column
							label="训练准确率"
							prop="train_accuracy"
						></el-table-column>
						<el-table-column
							label="测试准确率"
							prop="test_accuracy"
						></el-table-column>
						<el-table-column
							label="整体准确率"
							prop="overall_acc"
						></el-table-column>
						<el-table-column
							label="成员准确率"
							prop="member_acc"
						></el-table-column>
						<el-table-column
							label="非成员准确率"
							prop="nonmember_acc"
						></el-table-column>
						<el-table-column label="精确率" prop="precision"></el-table-column>
						<el-table-column label="召回率" prop="recall"></el-table-column>
						<el-table-column label="AUC" prop="auc"></el-table-column>
						<el-table-column
							label="低FPR时的TPR"
							prop="tpr_at_low_fpr"
						></el-table-column>
					</el-table>
					<el-text type="info" class="infoText">
						请注意历史记录仅提供最近三十次内的，呈时间倒序排列（最新的在最上方）
					</el-text>
				</page-container>
			</el-main>
		</el-container>
	</div>
</template>

<style scoped>
	.RHP-layout {
		width: 100%;
		height: 100%;
	}

	.RHP-container {
		width: 100%;
		height: 100%;
	}

	.RHP-header {
		background-color: rgb(142, 142, 142);
		width: 100%;
	}
</style>

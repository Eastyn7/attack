<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import { More, Edit, Delete, Document } from '@element-plus/icons-vue'
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'

	const router = useRouter()

	const projectList = ref([
		{
			projectName: '1',
			documentName: '世道公安',
		},
		{
			projectName: 2,
		},
		{
			projectName: 3,
		},
		{
			projectName: 4,
		},
		{
			projectName: 5,
		},
		{
			projectName: 6,
		},
		{
			projectName: 7,
		},
		{
			projectName: 8,
		},
		{
			projectName: 9,
		},
		{
			projectName: 10,
		},
		{
			projectName: 11,
		},
		{
			projectName: 12,
		},
		{
			projectName: 13,
		},
		{
			projectName: 14,
		},
		{
			projectName: 15,
		},
		{
			projectName: 16,
		},
		{
			projectName: 17,
		},
		{
			projectName: 18,
		},
		{
			projectName: 19,
		},
		{
			projectName: 20,
		},
	])
	const loading = ref(false)

	const handleRowClick = (row: any) => {
		console.log('点击了这一行')
		console.log(row)
		// 将row.projectName作为参数传递，假设接收页面的路由名为 /analyse/details
		router.push({
			path: '/analyse/details',
			query: {
				projectName: row.projectName,
			},
		})
	}

	const handleMore = (event: MouseEvent) => {
		event.stopPropagation()
	}

	// const handleViewDetail = (event: MouseEvent, row: any) => {
	// 	event.stopPropagation()
	// }

	// const handleRename = (event: MouseEvent, row: any) => {
	// 	event.stopPropagation()
	// }

	// const handleDelete = (event: MouseEvent, row: any) => {
	// 	event.stopPropagation()
	// }
</script>

<template>
	<el-container class="APP-container">
		<el-header class="APP-header">
			<div class="left">
				<span class="iconfont icon-biaoqian"></span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/analyse' }">
						数据分析
					</el-breadcrumb-item>
					<el-breadcrumb-item> 分析项目 </el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-button type="primary">新增分析</el-button>
		</el-header>
		<el-main class="APP-main">
			<el-container class="APP-detail-container">
				<el-table
					class="APP-detail-table"
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
					<el-table-column fixed label="项目名称" prop="projectName">
						<template #default="{ row }">
							<span class="iconfont icon-wenjianjia"></span>
							{{ row.projectName }}
						</template>
					</el-table-column>
					<el-table-column label="文件名称" prop="documentName">
						<template #default="{ row }">
							{{ row.documentName }}
						</template>
					</el-table-column>
					<el-table-column label="更新时间" prop="update_at">
						<template #default="{ row }">
							{{ row.update_at }}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template #default="">
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
										<el-dropdown-item>
											<el-icon> <Document /> </el-icon>查看详情
										</el-dropdown-item>
										<el-dropdown-item>
											<el-icon> <Edit /> </el-icon>重命名
										</el-dropdown-item>
										<el-dropdown-item>
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
</template>

<style scoped>
	.APP-container {
		width: 100%;
		height: 100%;
	}

	.APP-header {
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

	.APP-main {
		width: 100%;
		height: 100%;
		padding-top: 0;
	}

	.APP-detail-container {
		width: 100%;
		height: 100%;
	}

	.APP-detail-table {
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

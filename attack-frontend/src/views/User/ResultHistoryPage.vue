<script setup lang="ts">
	const resultList = ref([
		{
			id: 1,
		},
		{
			id: 2,
		},
		{
			id: 3,
		},
		{
			id: 4,
		},
		{
			id: 5,
		},
		{
			id: 6,
		},
		{
			id: 7,
		},
		{
			id: 8,
		},
		{
			id: 9,
		},
		{
			id: 10,
		},
		{
			id: 11,
		},
		{
			id: 12,
		},
		{
			id: 13,
		},
		{
			id: 14,
		},
		{
			id: 15,
		},
		{
			id: 16,
		},
		{
			id: 17,
		},
		{
			id: 18,
		},
		{
			id: 19,
		},
		{
			id: 20,
		},
	])
	const loading = ref(false)
</script>

<template>
	<div class="RHP-layout">
		<el-container class="RHP-container">
			<el-main class="RHP-main">
				<page-container title="审计历史记录">
					<el-table :data="resultList" v-loading="loading" height="380">
						<el-table-column fixed label="记录ID" prop="id">
							<template #default="{ row }">
								{{ row.id }}
							</template>
						</el-table-column>
						<el-table-column label="审计指标1" prop="target1">
							<template #default="{ row }">
								{{ row.target1 }}
							</template>
						</el-table-column>
						<el-table-column label="审计指标2" prop="target2">
							<template #default="{ row }">
								{{ row.target2 }}
							</template>
						</el-table-column>
						<el-table-column label="审计指标3" prop="target3">
							<template #default="{ row }">
								{{ row.target3 }}
							</template>
						</el-table-column>
						<el-table-column label="审计指标4" prop="target4">
							<template #default="{ row }">
								{{ row.target4 }}
							</template>
						</el-table-column>
						<el-table-column label="审计指标5" prop="target5">
							<template #default="{ row }">
								{{ row.target5 }}
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template></template>
						</el-table-column>
					</el-table>
					<el-text type="info" class="infoText">
						请注意历史记录仅供提供最近三十次内的
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

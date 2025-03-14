<script setup lang="ts"></script>

<template>
	<el-container class="PDDP-container">
		<el-empty
			class="PDDP-empty"
			:imageSize="400"
			description="该页面可以在线处理数据 敬请期待..."
		/>
	</el-container>
</template>

<style scoped>
	.PDDP-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.PDDP-empty {
		width: 100%;
		height: 100%;
	}
</style>

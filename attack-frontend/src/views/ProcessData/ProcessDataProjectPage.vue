<script setup lang="ts"></script>

<template>
	<el-container class="PDPP-container">
		<el-empty
			class="PDPP-empty"
			:imageSize="400"
			description="该页面可以在线处理数据 敬请期待..."
		/>
	</el-container>
</template>

<style scoped>
	.PDPP-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.PDPP-empty {
		width: 100%;
		height: 100%;
	}
</style>

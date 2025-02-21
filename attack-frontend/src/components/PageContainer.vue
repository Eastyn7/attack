<script lang="ts" setup>
	defineProps({
		title: {
			required: true,
			type: String,
		},
	})
</script>

<template>
	<el-card
		class="page-container"
		:body-style="{
			height: '85%',
			overflow: 'auto',
			scrollbarWidth: 'none',
		}"
	>
		<template #header>
			<div class="header">
				<span>{{ title }}</span>
				<div class="extra">
					<slot name="extra"></slot>
				</div>
			</div>
		</template>
		<template #default>
			<slot></slot>
		</template>
	</el-card>
</template>

<style scoped>
	.page-container {
		padding: 0;
		width: 100%;
		height: 100%;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>

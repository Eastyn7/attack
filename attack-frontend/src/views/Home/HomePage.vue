<script setup lang="ts">
	const calendar = ref()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const selectDate = (val: any) => {
		if (!calendar.value) return
		calendar.value.selectDate(val)
	}
</script>

<template>
	<!-- 左侧边栏 -->
	<el-aside class="container-aside">
		<el-empty description="等待更新中.." />
	</el-aside>
	<!-- 右侧操作区 -->
	<el-container>
		<el-container>
			<el-main>
				<el-calendar ref="calendar">
					<template #header="{ date }">
						<span>日历</span>
						<span>{{ date }}</span>
						<el-button-group>
							<el-button size="small" @click="selectDate('prev-year')">
								前一年
							</el-button>
							<el-button size="small" @click="selectDate('prev-month')">
								上一月
							</el-button>
							<el-button size="small" @click="selectDate('today')"
								>今天</el-button
							>
							<el-button size="small" @click="selectDate('next-month')">
								下一月
							</el-button>
							<el-button size="small" @click="selectDate('next-year')">
								后一年
							</el-button>
						</el-button-group>
					</template>
				</el-calendar>
			</el-main>
		</el-container>
	</el-container>
</template>

<style scoped></style>

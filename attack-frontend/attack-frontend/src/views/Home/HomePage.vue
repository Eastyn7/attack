<script setup lang="ts"></script>

<template>
	<div class="common-layout">
		<el-container>
			<el-header>
				<el-menu
					:default-active="activeIndex"
					class="el-menu-demo"
					mode="horizontal"
					:ellipsis="false"
				>
					<el-menu-item index="0">
						<img
							style="width: 100px"
							src="@/assets/home-background.jpg"
							alt="Element logo"
						/>
					</el-menu-item>
					<el-menu-item index="1">Processing Center</el-menu-item>
					<el-sub-menu index="2">
						<template #title>Workspace</template>
						<el-menu-item index="2-1">item one</el-menu-item>
						<el-menu-item index="2-2">item two</el-menu-item>
						<el-menu-item index="2-3">item three</el-menu-item>
						<el-sub-menu index="2-4">
							<template #title>item four</template>
							<el-menu-item index="2-4-1">item one</el-menu-item>
							<el-menu-item index="2-4-2">item two</el-menu-item>
							<el-menu-item index="2-4-3">item three</el-menu-item>
						</el-sub-menu>
					</el-sub-menu>
				</el-menu>
			</el-header>
			<el-container>
				<el-aside width="200px">Aside</el-aside>
				<el-container>
					<el-main>Main</el-main>
					<el-footer>Footer</el-footer>
				</el-container>
			</el-container>
		</el-container>
	</div>
</template>

<style scoped></style>

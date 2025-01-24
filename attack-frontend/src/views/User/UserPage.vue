<template>
	<div class="UP-layout">
		<el-container class="UP-container">
			<el-aside class="UP-aside">
				<el-menu
					class="menu"
					active-text-color="#1989fa"
					background-color="transparent"
					:default-active="$route.path"
					text-color="#fff"
					router
				>
					<el-sub-menu index="/user">
						<template #title>
							<el-icon>
								<UserFilled />
							</el-icon>
							<span>个人中心</span>
						</template>
						<el-menu-item index="/user/profile">
							<el-icon>
								<User />
							</el-icon>
							<span>基本资料</span>
						</el-menu-item>
						<el-menu-item index="/user/avatar">
							<el-icon>
								<Crop />
							</el-icon>
							<span>修改头像</span>
						</el-menu-item>
						<el-menu-item index="/user/history">
							<el-icon>
								<Promotion />
							</el-icon>
							<span>历史记录</span>
						</el-menu-item>
					</el-sub-menu>
				</el-menu>
			</el-aside>
			<el-main class="UP-main">
				<router-view></router-view>
			</el-main>
		</el-container>
	</div>
</template>

<script setup lang="ts">
	import { UserFilled, User, Crop, Promotion } from '@element-plus/icons-vue'
</script>

<style scoped>
	.UP-layout {
		width: 100%;
		height: 100%;
	}

	.UP-container {
		width: 100%;
		height: 100%;
	}

	.UP-aside {
		height: 100%;
		width: 15%;
		background-color: #242527;
	}
	.menu {
		border: none;
	}
</style>

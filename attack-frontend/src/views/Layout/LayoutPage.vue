<script setup lang="ts">
	import avatar from '@/assets/default.png'
	import {
		User,
		SwitchButton,
		CaretBottom,
		Promotion,
	} from '@element-plus/icons-vue'
	import { useUserStore } from '@/stores'
	import { useRouter, useRoute } from 'vue-router'

	const userStore = useUserStore()
	const router = useRouter()
	const route = useRoute()

	const onCommand = async (command: string) => {
		if (command === 'logout') {
			await ElMessageBox.confirm('你确认要退出吗？', '温馨提示', {
				type: 'warning',
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				draggable: true,
			})
			if (!userStore.rememberMe) {
				userStore.clearUserInfo()
			}
			userStore.logOut()
			ElMessage({
				type: 'success',
				message: '退出成功！',
			})
			router.push(`/authentication`)
		} else {
			router.push(`/user/${command}`)
		}
	}

	const isPathMatch = (menuPath: string) => {
		const currentPath = route.path
		return currentPath.includes(menuPath)
	}

	const activeMenuPath = computed(() => {
		if (isPathMatch('/home')) return '/home'
		if (isPathMatch('/mydata')) return '/mydata'
		if (isPathMatch('/processdata')) return '/processdata'
		if (isPathMatch('/analyse')) return '/analyse'
		return ''
	})
</script>

<template>
	<div class="home-layout">
		<el-container>
			<!-- 顶部导航栏 -->
			<el-header
				class="header"
				style="display: flex; align-items: center; justify-content: center"
			>
				<el-menu
					:default-active="activeMenuPath"
					class="header-menu"
					mode="horizontal"
					:ellipsis="false"
					router
				>
					<!-- 左 -->
					<el-menu-item index="/home">
						<h1>ATTACK</h1>
					</el-menu-item>
					<!-- 中 -->
					<el-menu-item index="/mydata">
						<span class="iconfont icon-wodeshuju myIconfont"></span>
						我的数据
					</el-menu-item>
					<el-menu-item index="/processdata">
						<span class="iconfont icon-shujuchuli myIconfont"></span>
						数据处理
					</el-menu-item>
					<el-menu-item index="/analyse">
						<span class="iconfont icon-shujufenxi myIconfont"></span>
						数据分析
					</el-menu-item>
					<!-- 右 -->
					<el-dropdown @command="onCommand">
						<span class="el-dropdown__box">
							<el-avatar
								:src="
									userStore.userInfo.avatar ? userStore.userInfo.avatar : avatar
								"
							/>
							<el-icon>
								<CaretBottom />
							</el-icon>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="profile" :icon="User"
									>账号信息</el-dropdown-item
								>
								<el-dropdown-item command="history" :icon="Promotion"
									>历史记录</el-dropdown-item
								>
								<el-dropdown-item command="logout" :icon="SwitchButton"
									>退出登录</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</el-menu>
			</el-header>
			<!-- 中间主体内容 -->
			<el-main style="height: 85vh; padding-top: 0">
				<el-container class="layou-main">
					<router-view></router-view>
				</el-container>
			</el-main>
			<!-- 底部页脚部分 -->
			<el-footer class="footer">
				<h4>ATTACK - 重庆工商大学1队&nbsp;</h4>
				<a href="https://beian.miit.gov.cn/" target="_blank">
					<h4>蜀ICP备2023043183号-1</h4>
				</a>
			</el-footer>
		</el-container>
	</div>
</template>

<style scoped>
	.home-layout {
		height: 100vh;
	}

	.header {
		width: 100%;
		height: 10vh;
	}

	.header-menu {
		width: 100%;
	}

	.el-dropdown__box {
		display: flex;
		align-items: center;

		.el-icon {
			color: #999;
			margin-left: 10px;
		}

		&:active,
		&:focus {
			outline: none;
		}
	}

	.container-aside {
		height: 100%;
	}

	.layou-main {
		height: 100%;
	}

	.el-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #666;
		height: 5vh;

		h4 {
			margin: 0;
		}
	}

	.el-menu--horizontal > .el-menu-item:nth-child(1) {
		margin-right: auto;
	}

	.el-menu--horizontal > .el-menu-item:nth-child(4) {
		margin-right: auto;
	}
	.myIconfont {
		margin-right: 5px;
		font-size: 21px;
	}
</style>

import { createRouter, createWebHashHistory } from 'vue-router'
import { isLogin } from '@/utils/util'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			component: () => import('@/views/Layout/LayoutPage.vue'),
			redirect: '/home',
			children: [
				{
					path: '/home',
					name: 'Home',
					component: () => import('@/views/Home/HomePage.vue'),
				},
				{
					path: '/mydata',
					name: 'MyData',
					component: () => import('@/views/MyData/MyDataPage.vue'),
				},
				{
					path: '/processdata',
					name: 'ProcessData',
					component: () => import('@/views/ProcessData/ProcessDataPage.vue'),
				},
				{
					path: '/analyse',
					name: 'Analyse',
					component: () => import('@/views/AnalyseData/AnalysePage.vue'),
					redirect: '/analyse/project',
					children: [
						{
							path: '/analyse/project',
							name: 'AnalyseProject',
							component: () =>
								import('@/views/AnalyseData/AnslyseProjectPage.vue'),
						},
						{
							path: '/analyse/details',
							name: 'AnalyseDetails',
							component: () =>
								import('@/views/AnalyseData/AnalyseDetailsPage.vue'),
						},
					],
				},
				{
					path: '/user',
					name: 'UserPage',
					component: () => import('@/views/User/UserPage.vue'),
					redirect: '/user/profile',
					children: [
						{
							path: '/user/profile',
							name: 'UserProfilePage',
							component: () => import('@/views/User/UserProfilePage.vue'),
						},
						{
							path: '/user/avatar',
							name: 'UserAvatarPage',
							component: () => import('@/views/User/UserAvatarPage.vue'),
						},
						{
							path: '/user/history',
							name: 'ResultHistoryPage',
							component: () => import('@/views/User/ResultHistoryPage.vue'),
						},
					],
				},
			],
		},
		{
			path: '/authentication',
			name: 'LoginRegister',
			component: () => import('@/views/LoginRegister/LoginRegisterPage.vue'),
		},
	],
})

// 定义加载框实例
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loadingInstance: any = null

router.beforeEach((to, from, next) => {
	// 创建加载框实例
	loadingInstance = ElLoading.service({
		lock: true,
		background: 'rgba(0, 0, 0, 0.4)',
		text: '页面加载中，请稍候...',
	})

	try {
		const unprotectedPaths = ['/authentication']

		// 判断是否需要登录验证
		if (!unprotectedPaths.includes(to.path) && !isLogin()) {
			// 如果未登录且访问需要登录的页面，先关闭加载框（若还未自动关闭的话），再重定向到登录页
			loadingInstance.close()
			return next('/authentication')
		}

		// 放行路由，让页面加载继续进行
		next()
	} catch (error) {
		console.error('路由加载过程中出现错误:', error)
	} finally {
		loadingInstance.close()
	}
})

export default router

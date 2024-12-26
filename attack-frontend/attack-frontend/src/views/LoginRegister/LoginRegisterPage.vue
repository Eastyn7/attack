<script setup lang="ts">
	import { User, Lock, Cpu } from '@element-plus/icons-vue'
	import { formToJson } from '@/utils/formToJson'
	import { useUserStore } from '@/stores'
	import { useRouter } from 'vue-router'

	const router = useRouter()

	const loginFormRef = ref()
	const registerFormRef = ref()

	const containerLeftSpan = ref(16)
	const containerRightSpan = ref(8)

	// 用户存储相关
	const userStore = useUserStore()
	// 控制显示登录表单还是注册表单，初始为登录表单
	const isLoginForm = ref(true)
	// 记住我
	const rememberMe = ref(false)

	// 登录表单数据模型
	const loginFormModel = ref({
		loginInput: '',
		password: '',
	})

	// 注册表单数据模型
	const registerFormModel = ref({
		username: '',
		password: '',
		confirmPassword: '',
	})

	// 登录表单校验规则
	const loginRules = {
		loginInput: [
			{
				required: true,
				message: '请输入用户名',
				trigger: 'blur',
			},
		],
		password: [
			{ required: true, message: '请输入密码', trigger: 'blur' },
			{
				pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
				message: '密码必须至少8位，且包含大小写字母和数字',
				trigger: 'blur',
			},
		],
	}

	// 注册表单校验规则（简化了一些，因为自定义验证函数可以统一处理一部分逻辑）
	const registerRules = {
		username: [
			{
				required: true,
				message: '请输入用户名',
				trigger: 'blur',
			},
		],
		password: [
			{ required: true, message: '请输入密码', trigger: 'blur' },
			{
				pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
				message: '密码必须至少8位，且包含大小写字母和数字',
				trigger: 'blur',
			},
		],
		confirmPassword: [
			{
				required: true,
				message: '请确认密码',
				trigger: 'blur',
			},
		],
	}

	// 登录方法
	const login = async () => {
		const loadingInstance = ElLoading.service({
			lock: true,
			text: '登录中，请稍候...',
			background: 'rgba(0, 0, 0, 0.7)',
		})
		try {
			// 先进行表单校验
			await loginFormRef.value.validate()
			// 校验成功后，记住我相关逻辑
			if (rememberMe.value) {
				userStore.setUsername(loginFormModel.value.loginInput)
				userStore.setRememberMe(true)
			} else {
				userStore.setRememberMe(false)
			}
			// 调用userStore里的登录方法，并传入参数
			await userStore.login(formToJson(loginFormModel.value))
			ElMessage.success('登录成功')
			router.push('/')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			ElMessage.error(error.message || '表单校验失败或其它错误')
		} finally {
			loadingInstance.close()
		}
	}

	// 注册方法
	const register = async () => {
		const loadingInstance = ElLoading.service({
			lock: true,
			text: '注册中，请稍候...',
			background: 'rgba(0, 0, 0, 0.7)',
		})
		try {
			// 先进行表单校验，这里对密码确认单独验证，因为有自定义逻辑
			await registerFormRef.value.validate()
			const passwordValid = validatePasswords()
			if (!passwordValid) {
				return
			}

			// 调用userStore里的注册方法，并传入参数
			await userStore.register(formToJson(registerFormModel.value))
			ElMessage.success('注册成功')
			router.push('/login') // 注册成功后跳转到登录页，可根据实际调整
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			ElMessage.error(error.message || '表单校验失败或其它错误')
		} finally {
			loadingInstance.close()
		}
	}

	const handleForgotPassword = () => {
		ElMessage({
			message: '该功能正在完善，请重新注册账号',
			type: 'info',
		})
	}

	// 自定义密码确认验证
	const validatePasswords = () => {
		if (!registerFormModel.value.confirmPassword) {
			ElMessage({
				message: '请确认密码',
				type: 'warning',
			})
			return false
		}
		if (
			registerFormModel.value.password !==
			registerFormModel.value.confirmPassword
		) {
			ElMessage({
				message: '两次输入的密码不一致',
				type: 'warning',
			})
			return false
		}
		return true
	}

	// 标语内容
	const slogan = '助您精准检测数据集与模型隐私风险无遗漏'

	// 控制打字机效果的状态
	const typedSlogan = ref<string[]>([]) // 存储每个字符
	const cursorVisible = ref(true)
	let index = 0
	let typeInterval: number | undefined // 用于保存定时器ID

	// 打字机效果的逻辑
	const typeSlogan = () => {
		if (index < slogan.length) {
			typedSlogan.value.push(slogan.charAt(index))
			index++
		} else {
			// 打字完成后停顿3秒，再重新开始打字机效果
			clearInterval(typeInterval) // 清除上一个定时器
			setTimeout(() => {
				index = 0
				typedSlogan.value = [] // 清空已打出的字符
				cursorVisible.value = true // 显示光标
				typeInterval = setInterval(typeSlogan, 300) // 重新启动定时器，打字速度调整为300ms
			}, 5000) // 停顿5秒后重新开始
		}
	}

	// 光标闪烁效果
	const blinkCursor = () => {
		setInterval(() => {
			cursorVisible.value = !cursorVisible.value
		}, 200)
	}

	// 页面加载后启动打字机效果和光标闪烁
	onMounted(() => {
		typeInterval = setInterval(typeSlogan, 300) // 启动打字机效果的定时器
		blinkCursor()

		if (userStore.rememberMe) {
			loginFormModel.value.loginInput = userStore.userInfo.username
			rememberMe.value = true
		}

		// 监听窗口大小变化，根据宽度调整左右部分的宽度占比
		const handleResize = () => {
			const width = window.innerWidth
			if (width < 1300) {
				containerLeftSpan.value = 0
				containerRightSpan.value = 20
			} else {
				containerLeftSpan.value = 16
				containerRightSpan.value = 8
			}
		}

		window.addEventListener('resize', handleResize)

		// 在组件销毁时移除监听事件，避免内存泄漏
		onBeforeUnmount(() => {
			window.removeEventListener('resize', handleResize)
		})
	})
</script>

<template>
	<div class="login-page">
		<!-- 背景图片部分，通过伪元素添加蒙层 -->
		<div class="bg"></div>
		<!-- 中间内容部分 -->
		<el-row class="login-page-container">
			<!-- 左边标语部分，添加打字机效果 -->
			<el-col :span="containerLeftSpan" class="container-left">
				<h1>保障数据隐私安全</h1>
				<div class="slogan-container">
					<div class="slogan-container">
						<!-- 显示打字机效果的标语 -->
						<span class="slogan">
							<!-- 用v-for来动态渲染每个字符 -->
							<span
								v-for="(char, index) in typedSlogan"
								:key="index"
								class="slogan-char"
								:style="{
									opacity: 1,
									transform: 'scale(1)',
									transitionDelay: `${index * 0.1}s`,
								}"
							>
								{{ char }}
							</span>
						</span>
						<!-- 显示光标 -->
						<span class="cursor" :style="{ opacity: cursorVisible ? 1 : 0 }">
							<el-icon>
								<Cpu />
							</el-icon>
						</span>
					</div>
				</div>
			</el-col>

			<!-- 右边表单部分 -->
			<el-col :span="containerRightSpan" class="container-right">
				<el-form
					v-if="isLoginForm"
					ref="loginFormRef"
					:model="loginFormModel"
					:rules="loginRules"
					size="large"
					autocomplete="off"
					class="form"
				>
					<h1>ATTACK超测平台</h1>
					<h2>登录</h2>
					<el-form-item prop="loginInput">
						<el-input
							v-model="loginFormModel.loginInput"
							placeholder="请输入用户名"
							:prefix-icon="User"
						/>
					</el-form-item>
					<el-form-item prop="password">
						<el-input
							v-model="loginFormModel.password"
							placeholder="请输入密码"
							:prefix-icon="Lock"
							type="password"
						/>
					</el-form-item>
					<el-form-item class="flex">
						<div class="flex">
							<el-checkbox v-model="rememberMe">记住我</el-checkbox>
							<el-link
								type="primary"
								:underline="false"
								@click="handleForgotPassword"
								>忘记密码？</el-link
							>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							class="button"
							block
							@click="login"
							auto-insert-space
							>登录</el-button
						>
					</el-form-item>
					<el-form-item class="form-bottom">
						<el-link @click="isLoginForm = false"> 暂无账号？前往注册 </el-link>
					</el-form-item>
				</el-form>
				<el-form
					v-if="!isLoginForm"
					ref="registerFormRef"
					class="form"
					:model="registerFormModel"
					:rules="registerRules"
					size="large"
					autocomplete="off"
					label-width="auto"
				>
					<h1>ATTACK超测平台</h1>
					<h2>注册</h2>
					<el-form-item prop="username">
						<el-input
							v-model="registerFormModel.username"
							placeholder="请输入用户名"
							:prefix-icon="User"
						/>
					</el-form-item>

					<el-form-item prop="password">
						<el-input
							v-model="registerFormModel.password"
							placeholder="请输入密码"
							:prefix-icon="Lock"
							type="password"
						/>
					</el-form-item>

					<el-form-item prop="confirmPassword">
						<el-input
							v-model="registerFormModel.confirmPassword"
							placeholder="请确认密码"
							:prefix-icon="Lock"
							type="password"
						/>
					</el-form-item>

					<el-form-item>
						<el-button
							type="primary"
							class="button"
							block
							@click="register"
							auto-insert-space
							>注册</el-button
						>
					</el-form-item>

					<el-form-item class="form-bottom">
						<el-link class="switch-btn" @click="isLoginForm = true">
							已有账号？前往登录
						</el-link>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped>
	.login-page {
		height: 100vh;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url('@/assets/home-background.jpg') no-repeat center / cover;
		border-radius: 10px 10px 10px 10px;
	}

	.bg::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.394);
		border-radius: 10px 10px 10px 10px;
	}

	.login-page-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.container-left {
		font-size: 30px;
		color: rgb(0, 0, 0);
		/* padding: 0px 50px 150px 50px; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #ffffffb6;
		height: 200px;
	}

	.container-left h1 {
		color: #1989fa;
		/* color: rgb(0, 0, 0); */
		font-size: 80px;
		text-shadow:
			1px 1px 0 #ffffff,
			2px 2px 0 #ffffff,
			3px 3px 0 #000000,
			4px 4px 0 #000000;
		letter-spacing: 5px;
		margin: 0px 0px;
	}

	.slogan-container {
		font-size: 40px;
		color: #000000;
		white-space: nowrap;
		overflow: hidden;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #000000;
	}

	.slogan-char {
		margin-left: 5px;
	}

	.cursor {
		font-size: 30px;
		color: #1989fa;
	}

	.container-right {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: #ffffff;
		border-radius: 15% 0% 0% 15%;
		padding: 50px 80px;
	}

	.container-right h1 {
		color: #000000;
		font-size: 50px;
		margin: 0px 0px 20px 0px;
		letter-spacing: 2px;
	}

	.container-right h2 {
		color: #000000;
		font-size: 40px;
		margin: 0px 0px 10px 0px;
		letter-spacing: 2px;
	}

	.form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		user-select: none;
		width: 100%;
		height: 100%;
	}

	.flex {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin: 0;
	}

	.button {
		width: 100%;
	}

	/* 媒体查询部分 */
	@media screen and (max-width: 1300px) {
		.container-left {
			display: none;
		}

		.container-right {
			border-radius: 0;
		}

		.form {
			width: 100%;
		}
	}
</style>

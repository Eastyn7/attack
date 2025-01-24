import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
				/\.md$/, // .md
			],
			imports: ['vue', 'vue-router', 'pinia'],
			dts: 'src/auto-import.d.ts',
			resolvers: [ElementPlusResolver()],
			// eslint 配置
			eslintrc: {
				enabled: true,
				filepath: 'src/.eslintrc-auto-import.json',
				globalsPropValue: true,
			},
		}),
		Components({
			// 搜索子目录
			deep: true,
			// 组件有效的扩展名
			extensions: ['vue', 'js', 'jsx', 'ts', 'tsx', '.mjs'],
			include: [/\.vue$/, /\.vue\?vue/, /\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
			resolvers: [ElementPlusResolver()],
			dirs: ['src/components'],
			dts: 'src/components.d.ts',
			directives: true,
		}),
	],
	base: '/',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 8080,
	},
})

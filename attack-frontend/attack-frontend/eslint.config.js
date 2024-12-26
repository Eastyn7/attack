import { readFile } from 'node:fs/promises'

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
// import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import eslintPluginPrettier from 'eslint-plugin-prettier' // 引入 prettier 插件
import eslintConfigPrettier from 'eslint-config-prettier' // 引入 prettier 配置

const autoImportFile = new URL(
	'./src/.eslintrc-auto-import.json',
	import.meta.url,
)
const autoImportGlobals = JSON.parse(await readFile(autoImportFile, 'utf8'))

export default [
	{
		languageOptions: {
			globals: {
				...autoImportGlobals.globals,
			},
		},
	},

	{
		name: 'app/files-to-lint',
		files: ['**/*.{ts,mts,tsx,vue}'],
	},

	{
		name: 'app/files-to-ignore',
		ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
	},

	skipFormatting,
	js.configs.recommended,
	...pluginVue.configs['flat/essential'],
	...vueTsEslintConfig(),

	// 修改 plugins 配置为正确的 flat config 格式
	{
		plugins: {
			vue: pluginVue,
			// '@typescript-eslint': typescriptEslintPlugin,
			prettier: eslintPluginPrettier, // 添加 prettier 插件
		},
	},

	// 添加规则配置
	{
		rules: {
			'no-console': 'off',
			'vue/multi-word-component-names': [
				'warn',
				{
					ignores: ['index'],
				},
			],
			'jsx-quotes': ['error', 'prefer-double'],
			'@typescript-eslint/explicit-function-return-type': ['off'],
			// '@typescript-eslint/explicit-function-return-type': [
			// 	'warn', // 设置为警告级别，而不是报错
			// 	{
			// 		allowExpressions: true, // 允许简单表达式函数不写返回类型，可按需调整
			// 		allowTypedFunctionExpressions: true, // 允许已类型化的函数表达式不写返回类型等情况，按需调整配置
			// 	},
			// ],
			'vue/no-setup-props-destructure': ['off'],
			'no-undef': 'error',

			// 启用 prettier 规则并进行格式化检查
			'prettier/prettier': [
				'error',
				{
					semi: false,
					tabWidth: 2,
					useTabs: true,
					printWidth: 80,
					arrowParens: 'always',
					bracketSpacing: true,
					endOfLine: 'auto',
					vueIndentScriptAndStyle: true,
					singleQuote: true,
				},
			],
		},
	},

	// 覆盖规则（针对特定文件）
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
		},
	},

	// 忽略模式（直接在配置文件中定义）
	{
		ignores: ['dist/', 'build/'],
	},

	// 使用 eslint-config-prettier 禁用所有 Prettier 相关的规则（避免冲突）
	eslintConfigPrettier,
]

# Attack

网安赛道攻击项目



# 前端开发

## 项目初始化

新建项目文件夹（attack-frontend）

```shell
pnpm create vue
```

## 配置Eslint和Prettier

eslint.config.js文件

~~~js
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
			'no-console': 'warn',
			'vue/multi-word-component-names': [
				'warn',
				{
					ignores: ['index'],
				},
			],
			'jsx-quotes': ['error', 'prefer-double'],
			'@typescript-eslint/explicit-function-return-type': [
				'warn', // 设置为警告级别，而不是报错
				{
					allowExpressions: true, // 允许简单表达式函数不写返回类型，可按需调整
					allowTypedFunctionExpressions: true, // 允许已类型化的函数表达式不写返回类型等情况，按需调整配置
				},
			],
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
			'@typescript-eslint/explicit-function-return-type': 'error',
		},
	},

	// 忽略模式（直接在配置文件中定义）
	{
		ignores: ['dist/', 'build/'],
	},

	// 使用 eslint-config-prettier 禁用所有 Prettier 相关的规则（避免冲突）
	eslintConfigPrettier,
]
~~~

.prettierrc.json文件

~~~js

{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "tabWidth": 2,
	"useTabs": true, 
	"printWidth": 100, 
	"arrowParens": "always", 
	"bracketSpacing": true, 
	"endOfLine": "auto", 
	"vueIndentScriptAndStyle": true,
  "singleQuote": true
}

~~~

## 引入element-ui组件库

安装UI库

```
pnpm add element-plus
```

安装图标库

```
pnpm i @element-plus/icons-vue
```

自动按需导入

1、安装插件

```
pnpm add -D unplugin-vue-components unplugin-auto-import
```

2、配置Vite文件

```js
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
```

## 配置Axios

安装Axios

~~~
pnpm add axios
~~~

配置Request文件

~~~tsx
import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { getLocalData, removeLocalData, isLogin } from '@/utils/util'
import router from '@/router'

// 自定义请求配置接口，扩展了 Axios 的配置选项
export interface CustomRequestConfig extends InternalAxiosRequestConfig {
  needToken?: boolean // 标识请求是否需要携带Token
}

// 创建axios实例，并设置基础配置
const http = axios.create({
  // baseURL: 'http://', // API远程地址
  // baseURL: 'http://127.0.0.1:3007/api', // 本地API的基础URL
  timeout: 10000 // 请求超时时间为10秒
})

// 请求拦截器
http.interceptors.request.use(
  (config: CustomRequestConfig) => {
    if (config.needToken) {
      const user = getLocalData('cqt-user')

      // 检查用户登录状态是否有效
      if (isLogin()) {
        // 如果登录状态有效，将 token 添加到请求头
        config.headers['Authorization'] = `${user.token}`
      } else {
        // 如果 token 已过期，清除用户数据并重定向到登录页
        removeLocalData('cqt-user')
        console.warn('登录已过期，请重新登录')

        // 重定向到登录页面
        router.replace('/login')

        // 拒绝请求，以阻止进一步的网络请求
        return Promise.reject('登录已过期，请重新登录')
      }
    }

    // 设置默认的 Content-Type
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data // 返回响应的 data 部分
  },
  (error) => {
    // 如果响应状态码为 401，说明 token 无效或已过期
    if (error.response && error.response.status === 401) {
      console.warn('登录已过期，请重新登录')

      // 清除本地用户信息并重定向到登录页
      removeLocalData('cqt-user')
      router.replace('/login')
    }

    return Promise.reject(error)
  }
)

// 导出处理好的 http 实例
export default http
~~~

## 配置Pinia

安装插件

~~~
pnpm add pinia-plugin-persistedstate -D
~~~

在仓库中导入

~~~tsx
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

export * from './modules/auth'
~~~















# 后端开发

## 项目初始化

新建项目文件夹（attack-backend）

```shell
npm init -y
```

按照express框架

~~~shell
npm i express
~~~

安装部分提示依赖

~~~shell
npm install typescript ts-node @types/node @types/express --save-dev
~~~

初始化TS配置

~~~shell
tsc --init
~~~

配置tsconfig.json文件

~~~tsx
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "./src",
    "outDir": "./dist",
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
~~~

## 创建项目入口

在根目录下创建src文件夹，并创建app.ts文件

~~~tsx
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { authenticateToken } from './middlewares/authenticationMiddleware';
import router from './routers/index';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// 全局使用 tokenMiddleware，它会自动跳过不需要验证的路由
app.use(authenticateToken);

// 路由
app.use('/api', router);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(3309, () => {
  console.log('API server running at http://127.0.0.1:3309');
});
~~~

## 配置项目目录结构

创建routers、controllers、services、utils、db、oss、types、middlewares文件夹

- routers：`index.ts`文件统一管理所有模块的路由；其他均为模块单独的路由管理
- controllers：每个模块的管理端代码，放置请求的整体代码
- services：每个模块的服务端代码，放置具体的请求内容和实现逻辑
- utils：
- db：
- oss：
- types：
- middlewares：

## 配置cors跨域

安装cors中间件

~~~shell
npm i cors
npm i --save-dev @types/cors
~~~

在app.js中配置cors中间件

~~~tsx
// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())
~~~

## 配置解析表单数据的中间件

配置解析 JSON 和 application/x-www-form-urlencoded 格式的表单数据的中间件

~~~tsx
// 配置解析表单数据的中间件
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
~~~

## 封装统一的响应格式

~~~tsx
// 封装统一的响应格式
import { Response } from 'express';

interface ResponseFormat {
  success: boolean;
  message: string;
  data?: any;
}

export const successResponse = (res: Response, data: any, message = 'Success', statusCode = 200) => {
  const response: ResponseFormat = {
    success: true,
    message,
    data
  };
  res.status(statusCode).json(response);
};

export const errorResponse = (res: Response, message: string, statusCode = 500) => {
  const response: ResponseFormat = {
    success: false,
    message
  };
  res.status(statusCode).json(response);
};
~~~

## 安装并配置mysql模块

安装 `mysql` 模块

```bash
npm i mysql
npm install @types/mysql --save-dev
```

新建 `/db/index.js` 文件，在此自定义模块中创建数据库的连接对象

```js
import mysql from 'mysql';

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '', // 数据库对应密码
  database: 'attack_db'
});

// 封装 db.query 为 Promise
export const query = <T>(sql: string, values?: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

export default db;
```

## 安装密码加密库 (`bcrypt`) 和 JWT 库

~~~shell
npm install bcrypt jsonwebtoken
npm install @types/bcrypt --save-dev
npm install @types/jsonwebtoken --save-dev
~~~

## 配置中间件

**错误处理中间件**（errorHandler.ts）

~~~tsx
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseUtil';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  errorResponse(res, err.message || 'Server error', 500);
};
~~~

**身份认证中间件**（authenticationMiddleware.ts）

~~~tsx
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const UNPROTECTED_PATH_REGEX = /^\/api\/public/; // 匹配所有以 /api/public 开头的路径

// 中间件：验证 JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  // 使用正则表达式检查路径是否需要跳过验证
  if (UNPROTECTED_PATH_REGEX.test(req.path)) {
    return next(); // 如果路径不需要验证，直接跳过中间件
  }

  const authHeader = req.headers['authorization']; // 从请求头中获取 Authorization
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token 格式

  if (!token) {
    return res.status(401).json({ message: '没有提供 token，访问被拒绝' });
  }

  // 验证 token 并解析
  jwt.verify(token, 'ATTACK', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'token 无效' });
    }

    // 将解码后的用户信息存入 request 对象中
    req.body.user = user;

    // 获取用户请求体中的 user_id
    const { user_id: requestAuthId } = req.body;
    const { user_id: analysisId } = req.body.user;

    // 比较解码出的 user_id 与请求中的 user_id 是否一致
    if (analysisId !== requestAuthId) {
      return res.status(403).json({ message: 'user_id 与 token 不匹配' });
    }

    next(); // 如果验证通过，继续执行下一个中间件或路由处理
  });
};
~~~

**表单验证中间件**（`validateInput.ts`）

~~~ts
import { errorResponse } from '../utils/responseUtil';
import { Request, Response, NextFunction } from 'express';

// 验证注册请求
export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username) {
    return errorResponse(res, '用户名不能为空！', 400);
  }

  if (!password || password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return errorResponse(res, '密码长度至少为6位，并且包含大小写字母和数字', 400);
  }

  // 验证通过，调用 next()
  next();
};

// 验证登录请求
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { loginInput, password } = req.body;

  if (!loginInput) {
    return errorResponse(res, '用户名禁止为空！', 400);
  }

  if (!password) {
    return errorResponse(res, '密码不能为空', 400);
  }

  // 验证通过，调用 next()
  next();
};
~~~

## 用户注册功能

userService.ts

~~~tsx
// 注册用户
export const registerUser = async (username: string, password: string): Promise<UserRegister> => {
  // 查询用户名是否已存在
  const existingUser = await query<User[]>('SELECT * FROM User_login WHERE username = ?', [username]);
  if (existingUser.length > 0) {
    throw new Error('用户名已存在');
  }

  // 哈希密码
  const passwordHash = await hashPassword(password);

  // 插入新用户到数据库
  const result = await query<{ insertId: number }>(
    'INSERT INTO user_login (username, password_hash) VALUES (?, ?)',
    [username, passwordHash]
  );

  // 获取新插入用户的 user_id
  const userId = result.insertId;

  // 数据库触发器已写
  // // 更新 username 到 user_info 表
  // await query('UPDATE user_info SET username = ? WHERE user_id = ?', [username, userId]);

  // 返回新注册的用户信息（不包含 password_hash）
  const newUser: UserRegister = { user_id: userId, username };
  return newUser;
};
~~~

userController.ts

~~~tsx
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username,  password } = req.body

  try {
    // 验证成功则调用服务层注册用户逻辑
    const newUser = await userService.registerUser(username, password)
    successResponse(res, newUser, '用户注册成功', 201)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}
~~~

publicRouter.ts

~~~tsx
// 注册路由
router.post('/register', validateRegistration, registerUser)
~~~

## 用户登录功能

userService.ts

~~~tsx
// 登录用户
export const loginUser = async (loginInput: string, password: string): Promise<{ user_id: number, username: string, token: string, expiresIn: number }> => {
  let UserLogin = await query<UserLogin[]>('SELECT * FROM User_login WHERE username = ?', [loginInput]);

  if (UserLogin.length === 0) {
    throw new Error('用户不存在');
  }

  // 验证密码是否匹配
  const validPassword = await comparePassword(password, UserLogin[0].password_hash);
  if (!validPassword) {
    throw new Error('密码错误');
  }

  // 生成JWT token
  const expiresIn = 3600; // 过期时间为3600秒（1小时）
  const token = 'Bearer ' + jwt.sign(
    { user_id: UserLogin[0].user_id, username: UserLogin[0].username },
    'ATTACK',
    { expiresIn: expiresIn } // 使用数字作为过期时间
  );

  // 返回用户信息和 token
  return {
    user_id: UserLogin[0].user_id,
    username: UserLogin[0].username,
    token,
    expiresIn
  };
};
~~~

userController.ts

~~~tsx
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { loginInput, password } = req.body

  try {
    // 调用服务层登录逻辑
    const user = await userService.loginUser(loginInput, password)
    successResponse(res, { user }, '登录成功', 200)

  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}
~~~

publicRouter.ts

~~~tsx
// 登录路由
router.post('/login', validateLogin, loginUser)
~~~


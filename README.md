# Attack

网安赛道攻击项目



# 前端开发

## 项目初始化

新建项目文件夹（attack-frontend）

```shell
pnpm create vue
```



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


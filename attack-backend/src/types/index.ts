type Gender = 0 | 1 | 2 // 0: 保密, 1: 男, 2: 女

export interface User {
  user_id: number                // 用户账户唯一自增id
  username: string               // 用户名
}

export interface UserLogin extends User {
  password_hash: string          // 加密后的密码值
}

export interface UserRegister extends User {
}

export interface UserInfo extends User {
  gender: Gender                  // 性别：0保密，1男，2女
  avatar: string                  // 用户头像
  phone: string                   // 电话
  email: string                   // 邮箱
}

export interface UpdateUserInfo {
  username?: string
  phone?: string
  gender?: Gender
  avatar?: string
  email?: string
}

export interface DataList {
  data_id: number
  user_id: number
  data_name: string
  file_path: string
}

export interface ProjectList {
  project_id: number
  data_id: number
  user_id: number
  project_name: string
}

export interface AuditInfo {
  audit_id: number
  audit_name: string
}

export interface AnalyseList {
  id: number;
  user_id: number;
  project_id: number;
  ModelTrainingAccuracy: number;
  ModelTestingAccuracy: number;
  OverallAttackAccuracy: number;
  MemberAccuracy: number;
  NonMemberAccuracy: number;
  Precision: number;
  Recall: number;
  AUC: number;
  CustomPrecision: number;
  CustomRecall: number;
}
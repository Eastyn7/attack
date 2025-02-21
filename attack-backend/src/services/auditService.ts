import { query } from '../db';
import { AuditInfo } from '../types';

// 创建审计方法
export const createAuditInfo = async (audit_name: string): Promise<any> => {
  // 查询审计方法名称是否已存在
  const existingAudit = await query<AuditInfo[]>('SELECT * FROM audit_info WHERE audit_name = ?', [audit_name]);
  if (existingAudit.length > 0) {
    throw new Error('已存在该审计方法');
  }

  // 插入新审计方法到 audit_info 表
  const result = await query<{ insertId: number }>(
    'INSERT INTO audit_info (audit_name) VALUES (?)',
    [audit_name]
  );

  // 获取新插入的 audit_id
  const auditId = result.insertId;

  return { audit_id: auditId, audit_name };
};


// 获取审计方法列表
export const getAuditInfoList = async (): Promise<AuditInfo[]> => {
  const auditInfoList = await query<AuditInfo[]>('SELECT * FROM audit_info');

  if (auditInfoList.length === 0) {
    throw new Error('没有找到审计方法');
  }

  // 返回用户的审计方法列表
  return auditInfoList;
};

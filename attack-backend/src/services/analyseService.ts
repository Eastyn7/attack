import axios from 'axios';
import { query } from '../db';
import { AnalyseList } from '../types';

export const analyzeData = async (
  user_id: number,
  project_id: number,
  dataUrl: string,
  modelUrl: string,
  attackMethod: number
): Promise<any> => {
  // 1️⃣ 查询 audit_info 表，获取 audit_python_name
  const auditSql = `SELECT audit_python_name FROM audit_info WHERE audit_id = ?;`;
  const auditResult = await query<{ audit_python_name: string }[]>(auditSql, [attackMethod]);

  if (auditResult.length === 0) {
    throw new Error(`未找到 attackMethod 对应的 audit_python_name，audit_id: ${attackMethod}`);
  }

  // 2️⃣ 替换 attackMethod 为 audit_python_name
  const attackPythonName = auditResult[0].audit_python_name;

  // 3️⃣ 发送攻击请求
  const attackResponse = await axios.post('http://attackpython.eastyn.cn:5000/attack', {
    dataUrl,
    modelUrl,
    attackMethod: attackPythonName
  });
  
  // 4️⃣ 解析返回的 JSON 数据
  const attackResult = attackResponse.data;

  // 5️⃣ 插入或更新数据库
  const insertSql = `
    INSERT INTO result_history (
      user_id, project_id, 
      train_accuracy, test_accuracy, overall_acc, 
      member_acc, nonmember_acc, \`precision\`, recall, auc, 
      tpr_at_low_fpr
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      train_accuracy = VALUES(train_accuracy),
      test_accuracy = VALUES(test_accuracy),
      overall_acc = VALUES(overall_acc),
      member_acc = VALUES(member_acc),
      nonmember_acc = VALUES(nonmember_acc),
      \`precision\` = VALUES(\`precision\`),
      recall = VALUES(recall),
      auc = VALUES(auc),
      tpr_at_low_fpr = VALUES(tpr_at_low_fpr)
  `;
  await query(insertSql, [
    user_id,
    project_id,
    attackResult.model_performance.train_accuracy,
    attackResult.model_performance.test_accuracy,
    attackResult.attack_results.overall_acc,
    attackResult.attack_results.member_acc,
    attackResult.attack_results.nonmember_acc,
    attackResult.attack_results.precision,
    attackResult.attack_results.recall,
    attackResult.attack_results.auc,
    attackResult.attack_results.tpr_at_low_fpr
  ]);

  // 6️⃣ 查询最新的数据
  const selectSql = `
    SELECT 
      train_accuracy, test_accuracy, overall_acc, 
      member_acc, nonmember_acc, \`precision\`, recall, auc, 
      tpr_at_low_fpr
    FROM result_history
    WHERE user_id = ? AND project_id = ?
  `;

  const analyseResult = await query<AnalyseList[]>(selectSql, [user_id, project_id]);

  if (analyseResult.length === 0) {
    throw new Error('没有找到结果');
  }

  return analyseResult[0];
};

export const getResultHistory = async (user_id: number): Promise<AnalyseList[] | null> => {
  const selectSql = `
    SELECT 
      id, project_id, train_accuracy, test_accuracy, overall_acc,
      member_acc, nonmember_acc, \`precision\`, recall, auc, 
      tpr_at_low_fpr
    FROM result_history
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT 30
  `;

  try {
    const result = await query<AnalyseList[]>(selectSql, [user_id]);

    if (result.length === 0) {
      return null; // 没有数据时返回 null
    }

    return result; // 返回最多 30 条数据，按 id 升序排序
  } catch (error) {
    console.error('Error fetching result history:', error);
    throw new Error('数据库查询失败');
  }
};

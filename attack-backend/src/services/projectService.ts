import { query } from '../db';
import { ProjectList } from '../types';

// 创建项目
export const createProjectList = async (user_id: number, data_id: number, project_name: string): Promise<any> => {
  // 查询项目名称是否已存在，确保同一用户不能有相同的 project_name
  const existingProject = await query<ProjectList[]>('SELECT * FROM project_list WHERE user_id = ? AND project_name = ?', [user_id, project_name]);
  if (existingProject.length > 0) {
    throw new Error('同一用户不能有相同的项目表名称');
  }

  // 插入新项目到 project_list 表
  const result = await query<{ insertId: number }>(
    'INSERT INTO project_list (user_id, data_id, project_name) VALUES (?, ?, ?)',
    [user_id, data_id, project_name]
  );

  // 获取新插入的 project_id
  const projectId = result.insertId;

  return { project_id: projectId, user_id, data_id, project_name };
};


// 获取项目列表
export const getProjectList = async (user_id: number): Promise<ProjectList[]> => {
  // 使用 JOIN 语句联合查询 project_list 和 data_list 表
  const sql = `
    SELECT 
      pl.project_name, 
      pl.updated_at, 
      dl.data_name
    FROM 
      project_list pl
    JOIN 
      data_list dl ON pl.data_id = dl.data_id
    WHERE 
      pl.user_id = ?
  `;
  const projectList = await query<ProjectList[]>(sql, [user_id]);

  if (projectList.length === 0) {
    throw new Error('没有找到项目');
  }

  // 返回用户的项目列表
  return projectList;
};

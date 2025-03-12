import { spawn } from 'child_process';
import { query } from '../db';
import { AnalyseList } from '../types';

export const analyzeData = async (user_id: number, project_id: number, datasetUrl: string, modelUrl: string, attackMethod: string): Promise<any> => {
  const sql = `
    SELECT 
      ModelTrainingAccuracy,
      ModelTestingAccuracy,
      OverallAttackAccuracy,
      MemberAccuracy,
      NonMemberAccuracy,
      \`Precision\`,
      \`Recall\`,
      \`AUC\`,
      CustomPrecision,
      CustomRecall
    FROM 
      result_history
    WHERE 
      user_id = ? AND project_id = ?
  `;
  const analyseResult = await query<AnalyseList[]>(sql, [user_id, project_id]);

  if (analyseResult.length === 0) {
    throw new Error('没有找到结果');
  }

  // 返回结果
  return analyseResult[0];
  // return new Promise((resolve, reject) => {
  //   const scriptPath = '../src/python_scripts/test.py';

  //   const args = [
  //     scriptPath,
  //     '--dataset_url', datasetUrl,
  //     '--model_url', modelUrl,
  //     '--attack_method', attackMethod
  //   ];

  //   console.log('Running Python script with args:', args);

  //   const pythonProcess = spawn('python', args, { cwd: process.cwd() });

  //   let result = '';
  //   let errorOutput = '';

  //   pythonProcess.stdout.on('data', (data) => {
  //     result += data.toString();
  //     console.log('Python stdout:', data.toString());
  //   });

  //   pythonProcess.stderr.on('data', (data) => {
  //     errorOutput += data.toString();
  //     console.error('Python stderr:', data.toString());
  //   });

  //   pythonProcess.on('close', (code) => {
  //     console.log(`Python process exited with code ${code}`);
  //     if (code === 0) {
  //       try {
  //         const jsonResult = JSON.parse(result);
  //         resolve(jsonResult);
  //       } catch (err) {
  //         reject('解析 Python 输出结果失败: ' + err);
  //       }
  //     } else {
  //       reject(`Python 脚本执行失败，错误信息: ${errorOutput}`);
  //     }
  //   });

  //   pythonProcess.on('error', (err) => {
  //     console.error('Failed to start Python process:', err);
  //     reject(err);
  //   });

  // });
};

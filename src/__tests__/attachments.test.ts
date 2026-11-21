/* 附件清单契约：public/attachments/<学期>__<课程>.json 由 build-catalog 生成、随提交入库。
 * 已上线课程中，除算法课（资料随仓库自建、无 data/ 目录）外，其余 10 门必须有清单且结构合法。 */
import { describe, expect, it } from 'vitest';
import mathAtt from '../../public/attachments/大一上__高等数学.json';
import osAtt from '../../public/attachments/大三上__操作系统.json';
import netAtt from '../../public/attachments/大三上__计算机网络.json';
import patAtt from '../../public/attachments/大二上__程序设计艺术与方法.json';
import aiAtt from '../../public/attachments/大三上__人工智能原理.json';
import saAtt from '../../public/attachments/大三上__软件体系结构.json';
import physAtt from '../../public/attachments/大二上__大学物理.json';
import caAtt from '../../public/attachments/大三上__计算机体系结构.json';
import pdAtt from '../../public/attachments/大一上__程序设计基础.json';
import ncdAtt from '../../public/attachments/大三上__计算机网络课程设计.json';
import napAtt from '../../public/attachments/大三上__网络攻防实践.json';
import hdAtt from '../../public/attachments/大三上__系统硬件综合设计.json';
import mcAtt from '../../public/attachments/大三上__移动计算与应用开发.json';
import nluAtt from '../../public/attachments/大三上__自然语言理解.json';
import oscdAtt from '../../public/attachments/大三下__操作系统课程设计.json';
import cpdAtt from '../../public/attachments/大三下__编译原理课程设计.json';
import ntrAtt from '../../public/attachments/大三下__网络工程师综合实训.json';
import cvAtt from '../../public/attachments/大三下__计算机视觉与深度学习.json';
import spmAtt from '../../public/attachments/大三下__软件项目管理.json';
import bdAtt from '../../public/attachments/大三下__大数据处理技术.json';
import capAtt from '../../public/attachments/大三下__计算机应用项目实训.json';
import aieAtt from '../../public/attachments/大三下__人工智能经济学.json';
import secAtt from '../../public/attachments/大三下__信息安全技术.json';
import dbAtt from '../../public/attachments/大三下__数据库系统.json';
import seAtt from '../../public/attachments/大三下__软件工程.json';
import stAtt from '../../public/attachments/大三下__软件测试.json';

interface AttNode {
  n: string;
  p: string;
  s?: number;
  c?: AttNode[];
  /** 来源仓库 key（文件清单.csv 溯源） */
  r?: string;
  /** 上游仓库内路径 */
  sp?: string;
  /** Git 上传者（由 build-catalog 从本地 git log 自动提取） */
  u?: string;
}
interface AttManifest {
  semester: string;
  course: string;
  cats: { name: string; tree: AttNode[] }[];
}

const CATS = ['课件', '试题', '附件'];
/** 上游资料仓库 + 本站仓库（r='self'：2025 课件随 HFUT-CS-Online 入库，文件可无 size 字段） */
const REPO_KEYS = ['sunmiao', 'styitches', 'mox', 'luna', 'self'];

const countFiles = (nodes: AttNode[]): number => nodes.reduce((a, x) => a + (x.c ? countFiles(x.c) : 1), 0);

const checkNodes = (nodes: AttNode[]) => {
  for (const node of nodes) {
    expect(node.n.length).toBeGreaterThan(0);
    expect(node.p).not.toContain('..');
    expect(node.p.startsWith('/')).toBe(false);
    if (node.u !== undefined) {
      expect(typeof node.u).toBe('string');
      expect(node.u.trim().length).toBeGreaterThan(0);
    }
    if (node.c) {
      expect(node.s).toBeUndefined();
      // 单一来源目录：r 与 sp 成对（sp 为仓库内目录路径，空串表示仓库根），供附件页生成跳转链接
      if (node.r !== undefined) {
        expect(REPO_KEYS).toContain(node.r);
        expect(node.sp).toBeDefined();
        expect(node.sp).not.toContain('..');
      } else {
        expect(node.sp).toBeUndefined();
      }
      checkNodes(node.c);
    } else {
      // 本站入库文件（r='self'）可无 size 字段；上游文件必须有 size
      if (node.r !== 'self' || node.s !== undefined) {
        expect(node.s ?? -1).toBeGreaterThanOrEqual(0);
      }
      // 溯源：r 与 sp 成对出现，r 必须是已登记的仓库之一
      if (node.r !== undefined || node.sp !== undefined) {
        expect(REPO_KEYS).toContain(node.r);
        expect(node.sp).not.toContain('..');
        expect(node.sp!.length).toBeGreaterThan(0);
      }
    }
  }
};

const manifests: Array<[string, AttManifest]> = [
  ['高等数学', mathAtt],
  ['操作系统', osAtt],
  ['计算机网络', netAtt],
  ['程序设计艺术与方法', patAtt],
  ['人工智能原理', aiAtt],
  ['软件体系结构', saAtt],
  ['大学物理', physAtt],
  ['计算机体系结构', caAtt],
  ['程序设计基础', pdAtt],
  ['计算机网络课程设计', ncdAtt],
  ['网络攻防实践', napAtt],
  ['系统硬件综合设计', hdAtt],
  ['移动计算与应用开发', mcAtt],
  ['自然语言理解', nluAtt],
  ['操作系统课程设计', oscdAtt],
  ['编译原理课程设计', cpdAtt],
  ['网络工程师综合实训', ntrAtt],
  ['计算机视觉与深度学习', cvAtt],
  ['软件项目管理', spmAtt],
  ['大数据处理技术', bdAtt],
  ['计算机应用项目实训', capAtt],
  ['人工智能经济学', aieAtt],
  ['信息安全技术', secAtt],
  ['数据库系统', dbAtt],
  ['软件工程', seAtt],
  ['软件测试', stAtt],
];

describe('附件清单（public/attachments）', () => {
  for (const [name, m] of manifests) {
    it(`${name}：清单结构合法且非空`, () => {
      expect(m.cats.length).toBeGreaterThan(0);
      for (const cat of m.cats) {
        expect(CATS).toContain(cat.name);
        checkNodes(cat.tree);
      }
      expect(countFiles(m.cats.reduce<AttNode[]>((a, c) => a.concat(c.tree), []))).toBeGreaterThan(0);
    });
  }
});
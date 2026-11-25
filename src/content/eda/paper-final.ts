import type { CoursePaper } from '../course-types';

/** EDA / FPGA 期末复习题（试题/FPGA期末复习题(答案)知识点题型.docx） */
const paper: CoursePaper = {
  id: 'eda-final',
  title: 'Verilog / FPGA 期末复习题',
  source: 'FPGA期末复习题(答案)知识点题型.docx + EDA-Verilog-HDL 期末复习题总结（两版 PDF）',
  answerSource: '原卷附答案',
  sections: [
    { title: '一、选择题', questionIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'] },
  ],
  questions: [
    {
      id: 's1',
      kind: 'single',
      question:
        '<p>基于 VHDL 设计的仿真包括：①门级时序仿真、②行为仿真、③功能仿真、④前端功能仿真。按照自顶向下的设计流程，其先后顺序应该是（　）。</p>',
      options: ['①②③④', '②①④③', '④③②①', '②④③①'],
      answer: 'D',
      explanation:
        '<p>自顶向下：先行为仿真（验证算法 / 结构），再前端功能仿真，再功能仿真，最后门级时序仿真。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: '设计流程与仿真' }],
    },
    {
      id: 's2',
      kind: 'single',
      question: '<p>执行 Quartus II 的（　）命令，可以检查设计电路错误。</p>',
      options: ['Create Default Symbol', 'Compiler 编译', 'Simulator 时序仿真', 'Timing Analyzer 时序分析'],
      answer: 'B',
      explanation: '<p>Compiler（编译）完成分析与综合，能报告设计错误。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: 'Quartus 流程' }],
    },
    {
      id: 's3',
      kind: 'single',
      question: '<p>在设计输入完成后，应立即对设计文件进行（　）。</p>',
      options: ['编辑', '编译', '功能仿真', '时序仿真'],
      answer: 'C',
      explanation: '<p>输入完成后先做功能仿真，验证逻辑功能是否正确，再综合、布局布线、时序仿真。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: '功能仿真' }],
    },
    {
      id: 's4',
      kind: 'single',
      question:
        '<p>电子系统设计优化主要考虑提高资源利用率、减少功耗（面积优化）及提高运行速度（速度优化），下列方法中不属于面积优化的是（　）。</p>',
      options: ['流水线设计', '资源共享', '逻辑优化', '串行化'],
      answer: 'A',
      explanation: '<p>流水线通过增加寄存器提高吞吐率，属于速度优化，通常会增加面积；其余三项都减少资源占用。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: '面积与速度优化' }],
    },
    {
      id: 's5',
      kind: 'single',
      question:
        '<p>在 VHDL 中，下列对进程（PROCESS）语句结构及语法规则的描述，不正确的是（　）。</p>',
      options: [
        'PROCESS 为一无限循环语句；敏感信号更新时启动进程，执行完成后等待下一次启动',
        '敏感信号参数表中，不一定要列出进程中使用的所有输入信号',
        '进程由说明部分、结构体部分和敏感信号三部分组成',
        '当前进程中声明的变量不可用于其他进程',
      ],
      answer: 'C',
      explanation:
        '<p>进程由<strong>说明部分</strong>和<strong>语句部分</strong>组成，敏感信号表是进程语句的组成部分之一，但不能说进程由「说明、结构体、敏感信号」三部分构成（结构体是设计单元的概念）。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: 'VHDL 进程' }],
    },
    {
      id: 's6',
      kind: 'single',
      question:
        '<p>IP 核在 EDA 技术和开发中占有重要地位。提供 VHDL 硬件描述语言功能块、但不涉及实现该功能模块具体电路的 IP 核为（　）。</p>',
      options: ['硬件 IP', '固件 IP', '软件 IP', '都不是'],
      answer: 'C',
      explanation: '<p>软件 IP 只提供语言级功能描述；硬件 IP 提供经过验证的物理实现（网表 / 版图）；固件 IP 介于两者之间。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: 'IP 核' }],
    },
    {
      id: 's7',
      kind: 'single',
      question: '<p>综合是 EDA 设计的关键步骤，下面对综合的描述中错误的是（　）。</p>',
      options: [
        '综合就是把抽象设计中的一种表示转换成另一种表示的过程',
        '综合就是将电路的高级语言转换成低级的、可与 FPGA/CPLD 相映射的功能网表文件',
        '为实现系统的速度、面积、性能要求，需要对综合加以约束，称为综合约束',
        '综合可理解为一种映射过程，并且这种映射关系是唯一的，即综合结果是唯一的',
      ],
      answer: 'D',
      explanation: '<p>综合结果受综合工具、约束条件、优化策略影响，并非唯一。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: '综合' }],
    },
    {
      id: 's8',
      kind: 'single',
      question:
        '<p>大规模可编程器件主要有 CPLD 和 FPGA 两类，下面对 FPGA 结构与工作原理的描述中，正确的是（　）。</p>',
      options: [
        'FPGA 全称为复杂可编程逻辑器件',
        'FPGA 是基于乘积项结构的可编程逻辑器件',
        '基于 SRAM 的 FPGA 器件，每次上电后必须进行一次配置',
        '在 Altera 公司生产的器件中，MAX7000 系列属于 FPGA 结构',
      ],
      answer: 'C',
      explanation:
        '<p>FPGA 为现场可编程门阵列（基于查找表 LUT）；CPLD 基于乘积项；SRAM 型 FPGA 掉电丢失配置，上电需重新配置；MAX7000 属于 CPLD。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: 'FPGA 结构' }],
    },
    {
      id: 's9',
      kind: 'single',
      question: '<p>大规模可编程器件主要有 CPLD 和 FPGA 两类，其中 CPLD 通过（　）实现其逻辑功能。</p>',
      options: ['可编程乘积项逻辑', '查找表（LUT）', '输入缓冲', '输出缓冲'],
      answer: 'A',
      explanation: '<p>CPLD 基于可编程乘积项（与或阵列）；FPGA 基于查找表。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: 'CPLD 结构' }],
    },
    {
      id: 's10',
      kind: 'single',
      question: '<p>进程中的信号赋值语句，其信号更新是（　）。</p>',
      options: ['按顺序完成', '比变量更快完成', '在进程最后完成', '都不对'],
      answer: 'C',
      explanation:
        '<p>信号赋值在进程结束时统一更新（具有延迟特性）；变量赋值则立即生效。这是 VHDL 中信号与变量的核心区别。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: '信号与变量' }],
    },
  ],
};

export default paper;

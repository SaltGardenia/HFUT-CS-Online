/** 嵌入式系统原理课程数据：六章课件精讲 + 期末试卷在线练习 */
import type { GenPaper } from '../types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';

const embPapers: GenPaper[] = [];

export { embPapers };

const embHome = {
  lede: `<p>依据课程组课件（《嵌入式系统原理》PPT-新 六章）整理的课程精讲：从嵌入式系统绪论、ARM 微处理器与编程模型、ARM 指令集与汇编程序设计，
  到嵌入式存储器系统、常用外围设备及接口、嵌入式 Linux 系统及其编程。课件以 S3C2440 为主线，硬件部分讲寄存器与引脚，软件部分讲 Bootloader 与驱动。</p>`,
  cards: [
    {
      title: '课程信息',
      html: `<p>课件按六章组织：绪论、ARM 微处理器与编程模型、ARM 指令集与汇编程序设计、嵌入式存储器系统、常用外围设备及接口、
      嵌入式 Linux 系统及其编程。实验平台为 ARM 开发板（S3C2440），实验内容包括 GPIO、中断、定时器、UART 与嵌入式 Linux 移植。</p>`,
    },
    {
      title: '资料构成',
      html: `<p>站点整理自 <strong>6 章课件</strong>（PPT-新；PPT-旧 同章课件作为附件保留）；<strong>期末试卷</strong>为扫描件，连同备考梳理收录在附件页，未作逐题转录；
      第 4～6 章课件 PDF 的中文字体映射损坏，页面内容按课件目录与图页核对后整理。</p>`,
    },
  ],
  blurbs: {
    deck1: '嵌入式系统定义与三要素；与桌面通用系统的区别（任务确定、实时性、可靠性、功耗、可裁剪、交叉开发）；发展历程、结构、分类与应用。',
    deck2: '微处理器与体系结构概念；ARM 公司、IP 核与 RISC/Load-Store；7 种运行模式与特权/异常模式；ARM/Thumb 状态切换；37 个寄存器与 CPSR/SPSR；大端小端；异常向量与处理。',
    deck3: '9 种寻址方式（立即、寄存器、偏移、间接、基址、多寄存器、堆栈、相对等）；数据处理/加载存储/跳转/状态寄存器/协处理器/异常指令；条件执行；汇编伪操作与程序结构；Thumb 指令集。',
    deck4: '存储器按介质与存取方式分类；S3C2440 存储器系统（Bank0～7、NOR/NAND 启动、Steppingstone）；外部芯片引脚连接；NOR 与 NAND Flash 的特点与连接；存储器控制寄存器。',
    deck5: '130 个 GPIO（GPA～GPJ）与三类寄存器；中断系统的挂起/屏蔽/优先级与处理流程；定时器、PWM、看门狗与 RTC；UART 帧格式、波特率计算与中断方式。',
    deck6: '嵌入式 Linux 三层结构；Bootloader 两阶段与 U-Boot 命令；内核配置、编译与裁剪；字符/块/网络设备与字符驱动结构；Shell 与 BusyBox 常用命令。',
  },
};

export const embSpec = {
  key: 'emb',
  base: '/emb',
  name: '嵌入式系统原理',
  tip: '嵌入式系统原理 · 六章课件精讲与期末试卷',
  unit: '章' as const,
  chapters: [ch1, ch2, ch3, ch4, ch5, ch6],
  papers: embPapers,
  home: embHome,
};

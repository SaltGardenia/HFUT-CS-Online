/* 第 5 章 常用外围设备及接口 —— 依据课件（154 页）整理 */
import type { GenChapter } from '../types';

const ch5: GenChapter = {
  id: 'deck5',
  no: '第5章',
  title: '常用外围设备及接口',
  subtitle: '通用输入输出端口 GPIO · 中断系统 · 定时部件 · 通用异步收发器 UART',
  lede:
    '<p>嵌入式处理器的价值在很大程度上取决于片内外设。本章以 S3C2440 为例讲四类最常用的外围接口：<strong>GPIO</strong>（通用输入输出端口）、<strong>中断系统</strong>、<strong>定时部件</strong>（定时器、看门狗）与 <strong>UART</strong>（通用异步收发器）。学习的落点是「看懂寄存器、会配置引脚功能、能写出轮询与中断两种驱动程序」。</p>',
  toc: [
    { id: 'sec-emb5-gpio', text: '5.1 通用输入输出端口（GPIO）', level: 2 },
    { id: 'sec-emb5-intr', text: '5.2 中断系统', level: 2 },
    { id: 'sec-emb5-timer', text: '5.3 定时部件', level: 2 },
    { id: 'sec-emb5-uart', text: '5.4 通用异步收发器（UART）', level: 2 },
  ],
  sections: [
    {
      id: 'sec-emb5-gpio',
      heading: '5.1 通用输入输出端口（GPIO）',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>构成</strong>：S3C2440 有 <strong>130 个 GPIO 引脚</strong>，分为 9 组 <code>GPA～GPJ</code>：端口 A（GPA）为 23 位输出端口；端口 B（GPB）11 位、端口 C（GPC）16 位、端口 D（GPD）16 位、端口 E（GPE）16 位、端口 F（GPF）8 位、端口 G（GPG）16 位、端口 H（GPH）11 位、端口 J（GPJ）13 位，均为输入/输出端口。</p>
            <p>每个端口具有<strong>多种功能</strong>，需要在主程序运行之前借助对应的<strong>控制寄存器</strong>进行编程设置；若某个 GPIO 引脚不用于特定功能，则可以将其设置为普通的输入输出引脚。每组端口通常有三类寄存器：<strong>控制寄存器</strong>（GPA～GPJ 的 CON，每 2 位选择一种功能）、<strong>数据寄存器</strong>（DAT，读写引脚电平）、<strong>上拉电阻寄存器</strong>（UP，使能/禁止内部上拉）。</p>
            <p>编程步骤：① 配置控制寄存器选择引脚功能（输入/输出/复用功能）；② 输出时写数据寄存器置高/低电平，输入时读数据寄存器；③ 需要时配置上拉、外部中断触发方式。GPIO 是按键、LED、蜂鸣器、LCD 控制线等最简单外设的接口方式。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb5-intr',
      heading: '5.2 中断系统',
      blocks: [
        {
          type: 'html',
          html: `
            <p>中断使 CPU 不必轮询外设，外设在需要时主动通知 CPU。S3C2440 的中断系统由<strong>中断源</strong>（外部中断 EINT、定时器、UART、ADC、DMA 等）、<strong>中断控制器</strong>与 ARM 内核的 IRQ/FIQ 两级结构组成：多个中断源先经<strong>子中断源</strong>与<strong>中断挂起寄存器</strong>汇总，再由<strong>中断模式寄存器</strong>选择 IRQ 或 FIQ，通过<strong>中断屏蔽寄存器</strong>允许/禁止，最后经<strong>优先级仲裁</strong>送 CPU。</p>
            <p>中断处理流程：外设置位挂起位 → 中断控制器按优先级产生 IRQ/FIQ → CPU 保存现场、跳转到异常向量 → 中断服务程序读取挂起寄存器判断中断源 → 处理 → <strong>清除挂起位</strong>（否则会重复中断）→ 恢复现场返回。S3C2440 还支持<strong>中断嵌套</strong>与<strong>快速中断 FIQ</strong>（FIQ 有独立寄存器组，响应更快）。</p>
            <p>与轮询方式相比，中断方式的 CPU 利用率高、响应及时，但需要正确的优先级配置与挂起位清除，否则会出现丢失中断或死循环。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb5-timer',
      heading: '5.3 定时部件',
      blocks: [
        {
          type: 'html',
          html: `
            <p>S3C2440 的定时部件包括<strong>定时器（Timer）</strong>、<strong>看门狗定时器（Watchdog）</strong>、<strong>实时时钟（RTC）</strong>与<strong>PWM 定时器</strong>。定时器内部有预分频器与分频器，把 PCLK 分频后作为计数时钟；计数寄存器递减到 0 时产生中断（或触发 DMA），并可由比较寄存器控制 PWM 占空比，用于电机调速、背光亮度调节等。</p>
            <p>定时器编程步骤：设置预分频值与分频系数确定计数时钟 → 设置计数初值（决定定时时间）→ 设置比较值（PWM 占空比）→ 清挂起位 → 启动定时器 → 在中断服务程序中处理。定时时间 = 计数初值 × 计数时钟周期。</p>
            <p><strong>看门狗</strong>本质上是一个递减计数器，程序正常运行时定期「喂狗」（重装计数值），若程序跑飞未能及时喂狗，计数器溢出产生复位，从而提高系统可靠性。<strong>RTC</strong> 用独立晶振供电，提供年月日时分秒与闹钟中断。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb5-uart',
      heading: '5.4 通用异步收发器（UART）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>UART 实现异步串行通信：数据按帧发送，一帧由起始位、数据位（5～8 位）、可选校验位与停止位组成，收发双方按约定的<strong>波特率</strong>同步。S3C2440 有 3 个 UART 通道，每个通道有发送/接收缓冲寄存器、控制寄存器、状态寄存器与波特率除数寄存器。</p>
            <p><strong>波特率设置</strong>：由 <code>UBRDIVn</code> 除数寄存器决定，公式为</p>
            <pre><code>UBRDIVn = (int)(PCLK / (bps × 16)) − 1</code></pre>
            <p>例如 PCLK=50MHz、波特率 115200 时，除数为 50 000 000/(115200×16)−1 ≈ 26。通信双方的波特率误差应控制在较小范围，否则会因采样偏移而出错。</p>
            <p>UART 的工作方式有<strong>轮询</strong>（查询状态寄存器的发送/接收就绪位）与<strong>中断</strong>（发送完成、接收非空、接收错误分别产生中断）两种。嵌入式开发中 UART 是最常用的调试通道：Bootloader 与内核通过串口输出启动信息，开发主机用串口终端与其交互。</p>`,
        },
      ],
    },
  ],
};

export default ch5;

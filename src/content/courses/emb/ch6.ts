/* 第 6 章 嵌入式 Linux 系统及其编程 —— 依据课件（117 页）整理 */
import type { GenChapter } from '../types';

const ch6: GenChapter = {
  id: 'deck6',
  no: '第6章',
  title: '嵌入式 Linux 系统及其编程',
  subtitle: '嵌入式系统的层次划分 · Bootloader · 内核移植与裁剪 · 设备驱动 · Shell · 常用命令',
  lede:
    '<p>嵌入式 Linux 系统按层次划分为<strong>硬件层</strong>、<strong>系统软件层</strong>与<strong>应用层</strong>：硬件层上是 Bootloader 与 OS 内核、设备驱动、文件系统，最上面是应用程序。课件以 FriendlyARM 的开发板为例说明这一结构。本章讲清从「板上电」到「应用跑起来」的整条链路：Bootloader 引导 → 内核启动与驱动加载 → 根文件系统挂载 → Shell 与应用程序。</p>',
  toc: [
    { id: 'sec-emb6-layer', text: '6.1 嵌入式系统的层次划分', level: 2 },
    { id: 'sec-emb6-boot', text: '6.2 Bootloader', level: 2 },
    { id: 'sec-emb6-kernel', text: '6.3 内核移植与裁剪', level: 2 },
    { id: 'sec-emb6-driver', text: '6.4 Linux 设备驱动', level: 2 },
    { id: 'sec-emb6-shell', text: '6.5 Shell 与常用命令', level: 2 },
  ],
  sections: [
    {
      id: 'sec-emb6-layer',
      heading: '6.1 嵌入式系统的层次划分',
      blocks: [
        {
          type: 'html',
          html: `
            <p>嵌入式 Linux 系统自上而下分为三层：<strong>应用层</strong>——用户程序；<strong>系统软件层</strong>——设备驱动、文件系统、OS 内核与 Bootloader；<strong>硬件层</strong>——处理器、存储器与外设。层次之间通过明确的接口交互：应用通过系统调用使用内核服务，内核通过驱动操作硬件，Bootloader 只负责把内核与文件系统加载起来。</p>
            <p>这种分层使系统各部分可以独立开发与替换：换硬件只需改驱动与 Bootloader，换应用不必关心底层；同一份内核通过配置可以适配不同板卡。课件用一块 FriendlyARM 开发板的实物图与三角层次图说明这一结构。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb6-boot',
      heading: '6.2 Bootloader',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>Bootloader</strong> 是系统上电后运行的第一段程序，作用是初始化硬件、建立内存空间映射，为加载操作系统内核准备好正确的环境。嵌入式系统通常没有通用的 BIOS，因此 Bootloader 的移植是板级开发的第一道关口。</p>
            <p>常见的 Bootloader 有 U-Boot、vivi、Blob、RedBoot 等，其中 <strong>U-Boot</strong> 支持 ARM、MIPS、PowerPC 等多种架构，功能最全。Bootloader 一般分两个阶段：<strong>Stage1</strong> 用汇编编写，完成关看门狗、初始化时钟与 SDRAM、设置栈、搬移 Stage2 到 SDRAM 等与硬件密切相关的操作；<strong>Stage2</strong> 用 C 编写，完成串口与网卡等外设初始化、加载内核与根文件系统、跳转到内核入口。</p>
            <p>Bootloader 还提供交互命令（如 <code>printenv</code>、<code>setenv</code>、<code>tftp</code>、<code>nand read/write</code>、<code>bootm</code>），开发阶段通过串口或网口下载内核与文件系统镜像，量产时则从 Flash 中直接引导。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb6-kernel',
      heading: '6.3 内核移植与裁剪',
      blocks: [
        {
          type: 'html',
          html: `
            <p>Linux 内核由进程管理、内存管理、文件系统、网络协议栈、设备驱动等子系统组成。移植到目标板要做三件事：<strong>配置</strong>——选定与板卡匹配的默认配置（<code>make menuconfig</code>），打开必要的驱动与文件系统类型；<strong>编译</strong>——生成 <code>zImage</code> 内核镜像与设备树/机器码；<strong>裁剪</strong>——去掉不需要的功能以减小体积、加快启动。</p>
            <p>裁剪的依据是产品的实际需求：不需要网络就去掉协议栈的大部分，不需要图形界面就不编入 framebuffer 相关驱动。课件强调嵌入式系统「内核小、资源少、够用就行」的原则，裁剪是嵌入式 Linux 开发的常规工作。内核启动后挂载根文件系统（initramfs、YAFFS、UBIFS、ext4 等），执行 <code>/sbin/init</code> 进入用户空间。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb6-driver',
      heading: '6.4 Linux 设备驱动',
      blocks: [
        {
          type: 'html',
          html: `
            <p>Linux 把设备抽象为文件，应用通过 <code>open/read/write/ioctl/close</code> 等系统调用访问设备，由<strong>设备驱动</strong>完成具体的硬件操作。设备分三类：<strong>字符设备</strong>（按字节流访问，如串口、LED、按键）、<strong>块设备</strong>（按块访问，如 Flash、磁盘）、<strong>网络设备</strong>（通过 socket 访问，如网卡）。</p>
            <p>字符设备驱动的基本结构包括：设备号（主/次设备号）的申请与注册、<code>file_operations</code> 结构体中各函数的实现（open、read、write、ioctl、release）、<code>cdev</code> 的初始化与添加、模块的加载与卸载函数。驱动中通过 <code>ioremap</code> 把物理寄存器地址映射为虚拟地址，再用 <code>readl/writel</code> 读写寄存器；中断处理用 <code>request_irq</code> 注册，处理完成后返回 <code>IRQ_HANDLED</code>。</p>
            <p>驱动可以编译进内核，也可以编成模块（<code>.ko</code>）在运行时用 <code>insmod</code>/<code>rmmod</code> 加载卸载——后者便于调试。设备文件由 <code>mknod</code> 创建或由 udev/mdev 自动生成。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb6-shell',
      heading: '6.5 Shell 与常用命令',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>Shell</strong> 是用户与内核之间的命令解释器，读取命令、解释后交给内核执行。常见的有 Bourne Shell（sh）、Bash、Ash（BusyBox 提供，嵌入式常用）。Shell 支持管道、重定向、通配符、变量、条件与循环、脚本编程，是嵌入式系统调试与自动化的重要工具。</p>
            <p>嵌入式 Linux 常用命令与桌面 Linux 基本一致，但工具集通常由 <strong>BusyBox</strong> 提供（一个可执行文件集成上百个命令，体积小）：文件操作（<code>ls</code>、<code>cp</code>、<code>mv</code>、<code>rm</code>、<code>mkdir</code>、<code>cat</code>）、权限（<code>chmod</code>、<code>chown</code>）、进程（<code>ps</code>、<code>kill</code>、<code>top</code>）、网络（<code>ifconfig</code>、<code>ping</code>、<code>route</code>）、挂载（<code>mount</code>、<code>umount</code>）、模块（<code>lsmod</code>、<code>insmod</code>、<code>rmmod</code>）、设备（<code>mknod</code>、<code>ls /dev</code>）等。</p>
            <p>开发流程中，主机与目标板常通过 NFS 共享根文件系统、通过 TFTP 下载内核、通过串口查看启动日志；产品化时再把这些内容固化到 Flash 中。掌握 Shell 与这些命令，是从「能启动」走向「能调试、能部署」的关键。</p>`,
        },
      ],
    },
  ],
};

export default ch6;

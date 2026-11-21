/* 第1章 概述 —— 逐页转录自 课件/PPT/第1章 概述.pdf（20 页，全文提取 + 蒙太奇/放大裁剪核对）；
   纯图页（安全威胁分类思维导图、信息安全知识体系图、从 TCSEC 到 CC 国际标准的演变图、
   TCSEC 安全等级表、数独题面）已转录或以（课件图示 …）标注；
   B 站视频链接以超链接形式保留；课件页脚页码与 PDF 物理页号不一致（如 PDF 第 4 页页脚为"第5页"），照录无碍。 */
import type { SecChapter } from './types';

const ch1: SecChapter = {
  id: 'deck1',
  no: '第1章',
  title: '信息安全概述',
  subtitle: '课程导学 · 信息安全隐患与威胁分类 · 安全目标与防护策略 · 安全评估标准（TCSEC→CC）· 零知识证明与百万富翁问题引入',
  lede:
    '<p>本章内容：课程与教材信息、信息安全定义与安全隐患、安全威胁的分类、安全目标与安全防护策略、安全事件举例、信息安全 / 网络安全 / 数据安全的关系、信息安全知识体系、信息系统安全评估标准（从 TCSEC 到 CC 国际标准的演变），并以零知识证明（数独游戏）与姚式百万富翁问题作引入。</p>',
  toc: [
    { id: 'sec-sec1-course', text: '课程信息与教学内容', level: 2 },
    { id: 'sec-sec1-basics', text: '信息安全：定义、隐患与威胁', level: 2 },
    { id: 'sec-sec1-goal', text: '安全目标、防护策略与安全事件', level: 2 },
    { id: 'sec-sec1-relations', text: '需要理解的几个关系与知识体系', level: 2 },
    { id: 'sec-sec1-standards', text: '信息系统安全评估标准', level: 2 },
    { id: 'sec-sec1-examples', text: '引入举例：零知识证明与百万富翁问题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-sec1-course',
      heading: '课程信息与教学内容',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>教学内容</strong></p>
            <ul>
              <li>第1章 信息安全概述</li>
              <li>第2章 对称密码学</li>
              <li>第3章 非对称密码学</li>
              <li>第4章 消息认证</li>
              <li>第5章 安全技术应用</li>
              <li>第6章 安全前沿技术</li>
            </ul>
            <p><strong>能够学到</strong>：密码学术语，密码学主流算法，身份认证，现实中涉及安全的应用。<strong>不能学到</strong>：密码学数学基础（群论等）。</p>
            <p><strong>课外教材</strong></p>
            <ol>
              <li>刘建伟、王育民，网络安全-技术与实践，清华大学出版社</li>
              <li>蔡晶晶、李炜，网络空间安全导论，机械工业出版社</li>
              <li>刘建伟. 网络安全概论. 电子工业出版社.</li>
              <li>William Stallings. 密码编码学与网络安全-原理与实践. 电子工业出版社.</li>
            </ol>`,
        },
      ],
    },
    {
      id: 'sec-sec1-basics',
      heading: '信息安全：定义、隐患与威胁',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1 信息安全</strong></p>
            <p>信息安全，ISO（国际标准化组织）的定义为：为数据处理系统建立和采用的技术、管理上的安全保护，为的是保护计算机硬件、软件、数据不因偶然和恶意的原因而遭到破坏、更改和泄露。</p>
            <ul>
              <li>WannaCry勒索病毒：<a href="https://www.bilibili.com/video/BV11y4y1m79z/">视频链接（B 站）</a></li>
              <li>震网病毒：<a href="https://www.bilibili.com/video/BV1TK411J7tG/">视频链接（B 站）</a></li>
              <li>个人隐私：<a href="https://www.bilibili.com/video/BV175411a71j/">视频链接（B 站）</a></li>
            </ul>
            <p><strong>1 信息安全的安全隐患</strong></p>
            <ul>
              <li><strong>假冒</strong>：不合法的用户侵入到系统，通过输入账号等信息冒充合法用户从而窃取信息的行为</li>
              <li><strong>身份窃取</strong>：合法用户在正常通信过程中被其他非法用户拦截</li>
              <li><strong>数据窃取</strong>：非法用户截获通信网络的数据</li>
              <li><strong>否认</strong>：通信方在参加某次活动后却不承认自己参与</li>
              <li><strong>拒绝服务</strong>：合法用户在提出正当的申请时，遭到了拒绝或者延迟服务</li>
              <li><strong>非访问授权</strong>：访问没有权限的文件</li>
            </ul>
            <p><strong>安全威胁的分类</strong>（课件思维导图转录）：</p>
            <ul>
              <li><strong>线缆连接</strong>：冒名顶替、拨号进入、窃听</li>
              <li><strong>物理威胁</strong>：废物搜寻、偷窃、间谍行为、身份识别错误、自然或战争灾害</li>
              <li><strong>身份鉴别</strong>：算法考虑不周、随意口令、口令破解、口令圈套</li>
              <li><strong>系统漏洞</strong>：不安全服务、配置、初始化、乘虚而入</li>
              <li><strong>编程</strong>：病毒、特洛伊木马、代码炸弹、更新或下载</li>
            </ul>
            <p>（课件图示：安全威胁分类思维导图——中心为"安全威胁"，五大分支按上述归类连线）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec1-goal',
      heading: '安全目标、防护策略与安全事件',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1 安全目标</strong></p>
            <ul>
              <li><strong>机密性（Confidentiality）</strong>：私密的或机密的信息不能透露给非授权的个体。</li>
              <li><strong>完整性（Integrity）</strong>：信息和程序只能按指定的且授权的方式修改。</li>
              <li><strong>可用性（Availability）</strong>：系统必须及时地工作，不能拒绝向授权用户提供服务。</li>
              <li><strong>授权性</strong>：授权能够明确用户的权限，这决定了用户能否对网络信息系统进行访问，是用户进一步操作各项信息数据的前提。</li>
              <li><strong>抗抵赖性</strong>：操作用户无法否认自身在网络上的各项操作，整个操作过程均能够被有效记录。</li>
            </ul>
            <p><strong>1 安全防护策略</strong></p>
            <ul>
              <li><strong>加强安全防护意识</strong>：提高自身安全意识，拒绝下载不明软件，禁止点击不明网址、提高账号密码安全等级、禁止多个账号使用同一密码等，加强自身安全防护能力。</li>
              <li><strong>科学采用数据加密技术</strong>：它能够最大限度的避免信息泄露的风险，从而保护信息安全。</li>
              <li><strong>提高硬件质量</strong>：硬件系统在考虑安全性的基础上，还必须重视硬件的使用年限问题，硬件作为计算机的重要构成要件，其具有随着使用时间增加其性能会逐渐降低的特点，用户应注意这一点，在日常中加强维护与修理。</li>
              <li><strong>加强计算机入侵检测技术的应用</strong>：入侵检测主要是针对数据传输安全检测的操作系统，通过 IDS（入侵检测系统）入侵检测系统的使用，可以及时发现计算机与网络之间异常现象，通过报警的形式给予使用者提示。</li>
              <li><strong>其他措施</strong>：加强计算机网络密码设置、安装系统漏洞补丁程序等。</li>
            </ul>
            <p><strong>1 安全事件举例</strong></p>
            <ul>
              <li><strong>利用计算机进行经济犯罪</strong>——2016年2月，黑客企图从孟加拉国一家银行窃取10亿美元：<a href="https://www.bilibili.com/video/BV1TT4y1E7KF/">视频链接（B 站）</a></li>
              <li><strong>NVIDIA信息泄露事件</strong>：<a href="https://www.bilibili.com/video/BV1La411h7bS/">视频链接（B 站）</a></li>
              <li><strong>阿里云香港地区服务器宕机事件</strong>：<a href="https://www.bilibili.com/video/BV1MG4y1P75D/">视频链接（B 站）</a></li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-sec1-relations',
      heading: '需要理解的几个关系与知识体系',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1.2 需要理解的几个关系</strong></p>
            <p><strong>信息安全和网络安全、数据安全的关系？</strong></p>
            <ul>
              <li><strong>网络安全</strong>是以网络为主要的安全体系，主要涉及网络安全域、防火墙、网络访问控制、抗DDoS等场景，更多是指向整个网络空间的环境。网络安全的客观概念是网络系统包括使用网络过程中网络信息的产生、储存、传输和使用都不受任何威胁与侵害，能正常地实现资源共享功能。</li>
              <li><strong>数据安全</strong>是以数据为中心，主要关注数据安全周期的安全和合规性，以此来保护数据的安全。数据安全具有两层含义：一是数据本身的安全，主要是指采用现代密码算法对数据进行主动保护，如数据保密、数据完整性、双向强身份认证等；二是数据防护的安全，主要是采用现代信息存储手段对数据进行主动防护，如通过磁盘阵列、数据备份、异地容灾等手段保证数据的安全。</li>
              <li><strong>信息安全</strong>是指信息在生产、传输、处理和储存过程中不被泄漏或破坏，确保信息的可用性、保密性、完整性和不可否认性，并保证信息系统的可靠性和可控性。</li>
              <li>信息不一定存在网络空间中，因此一切都有可能造成信息泄露、信息篡改等，除了常见的网络入侵窃密，还包括网络之外的场景，比如人性弱点的利用、间谍等造成的信息安全事件。</li>
            </ul>
            <ul>
              <li>侧信道攻击（Side Channel Attack）：<a href="https://www.bilibili.com/video/BV1PT4y137cG/">视频链接（B 站）</a></li>
              <li>社会工程学：<a href="https://www.bilibili.com/video/BV15V411u7Za/">视频链接（B 站）</a></li>
            </ul>
            <p><strong>1 信息安全知识体系</strong>（课件图示：信息安全知识体系全景图——涵盖物理安全、系统安全/平台安全、网络安全、数据/信息的安全、攻击与防御技术、安全评估与准则、密码学与安全协议等板块）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec1-standards',
      heading: '信息系统安全评估标准',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1 信息系统安全评估标准</strong></p>
            <p><strong>有关信息安全的国内外标准</strong>：TCSEC、CC、ISO/IEC 15408-1、BS 7799 / ISO 17799、中国计算机安全等级划分。</p>
            <p>（课件图示：从 TCSEC 到 CC 国际标准的演变——美国 TCSEC 标准('83, '85) 与欧洲 ITSEC 标准1.2('91)、加拿大 CTCPEC 标准3('93)、美国联邦标准草案('92)、欧洲国家和地区建标工作('89-'93)、加拿大建标工作('89-'93)、ISO 建标工作('92--) 汇合成 CC标准1.0('96) 与 CC标准项目('93--)，成为国际标准 ISO/IEC 15408('99)）</p>
            <p>1985年，美国国防部颁布了全球第一个可信计算机评估准则（TCSEC），通常称为橘皮书。按照计算机系统的安全防护能力，分成4个等级共7个级别。TCSEC对后来的信息安全评估标准的建立起了重要参考作用。</p>
            <p>TCSEC将计算机系统的安全划分为四个等级、七个安全级别（从低到高依次为D1、C1、C2、B1、B2、B3和A1级）。</p>
            <p>1996年，美国和欧洲联合提出了信息技术安全评估通用标准（CC for ITSEC）并成为国际标准ISO15408。CC对信息安全具有重要意义，是信息技术安全评价标准以及信息安全技术发展的一个重要里程碑。</p>
            <p><strong>TCSEC 安全等级表</strong>（课件图示表格转录）：</p>
            <table class="tbl">
              <thead><tr><th>序</th><th>等级组</th><th>等级组名称</th><th>等级</th><th>等级名称</th><th>主要特征</th><th>典型系统</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>D</td><td>最低保护等级</td><td>D</td><td>无安全保护</td><td>无访问控制</td><td>DOS、Windows 9x、Macintosh System 7.1。</td></tr>
                <tr><td rowspan="2">2</td><td rowspan="2">C</td><td rowspan="2">自主保护等级</td><td>C1</td><td>自主安全保护</td><td>自主访问控制</td><td>UNIX、XENIX、Novell</td></tr>
                <tr><td>C2</td><td>可控访问保护</td><td>超C1的自主访问控制，审计功能</td><td>高版本的Unix、Windows NT、Windows xp、Windows2000、Oracle</td></tr>
                <tr><td rowspan="3">3</td><td rowspan="3">B</td><td rowspan="3">强制保护等级</td><td>B1</td><td>标记安全保护</td><td>强制访问控制，敏感度标记</td><td>OFS/1、Trusted Oracle、Incorporated INFORMAIX-OnLine/Secure</td></tr>
                <tr><td>B2</td><td>可结构化保护</td><td>形式化模型，隐蔽通道约束</td><td>Trusted Xenix</td></tr>
                <tr><td>B3</td><td>安全区域保护</td><td>安全内核，高抗渗透能力</td><td>Honeywell Federal Systems XTS-200</td></tr>
                <tr><td>4</td><td>A</td><td>验证保护等级</td><td>A1</td><td>可验证保护</td><td>形式化安全验证，隐蔽通道分析</td><td>Honeywell公司的SCOMP</td></tr>
              </tbody>
            </table>
            <p>（注：B1 行"OFS/1""INFORMAIX"与 C2 行"Windows xp"等为课件原样照录。）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec1-examples',
      heading: '引入举例：零知识证明与百万富翁问题',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>举例1：零知识证明---数独游戏</strong></p>
            <p>问题：如何向其他人证明你已经解开数独游戏，并且不透露具体的数字摆放？（课件图示：9×9 数独题面）</p>
            <p><strong>举例2：姚式百万富翁问题</strong></p>
            <p>问题：两个百万富翁都想比较到底谁更富有，但是有都不想让对方知道自己有多少钱。假定两人都值得信任，不会作假。那么，在没有可信的第三方的情况下如何比较？</p>`,
        },
      ],
    },
  ],
};

export default ch1;

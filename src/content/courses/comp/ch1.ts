/* 第 1 章 引论 —— 依据课件「编译原理：第1章 引论（唐益明）」整理（47 页） */
import type { GenChapter } from '../types';

const ch1: GenChapter = {
  id: 'deck1',
  no: '第1章',
  title: '引论',
  subtitle: '编译程序与解释程序 · 编译的五个阶段 · 编译程序的结构 · 编译前端与后端 · 编译程序的生成',
  lede:
    '<p>本章给出编译原理的基本轮廓：先把「编译程序」与「解释程序」的概念区分清楚，再以一个 C 语言程序为例走完词法分析、语法分析、中间代码产生、优化、目标代码产生五个阶段，最后介绍编译程序的总体结构（表格管理、出错处理）、遍的划分、前端与后端的分工，以及自展与自动产生等生成手段。课件把编译理论与方法称为「计算机科学与技术中理论和实践相结合的最好典范」：ACM 图灵奖所表彰的成果中，程序设计语言与编译理论约占三分之一。</p>',
  toc: [
    { id: 'sec-comp1-what', text: '1.1 什么是编译程序', level: 2 },
    { id: 'sec-comp1-process', text: '1.2 编译过程：五个阶段', level: 2 },
    { id: 'sec-comp1-structure', text: '1.3 编译程序的结构', level: 2 },
    { id: 'sec-comp1-pass', text: '1.4 遍、前端与后端', level: 2 },
    { id: 'sec-comp1-generate', text: '1.5 编译程序的生成', level: 2 },
    { id: 'sec-comp1-summary', text: '1.6 小结与课程要求', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comp1-what',
      heading: '1.1 什么是编译程序',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>翻译程序</strong>：把某一种语言程序（源语言程序）等价地转换成另一种语言程序（目标语言程序）的程序。</p>
            <p><strong>编译程序（compiler）</strong>：把某一种高级语言程序等价地转换成某一种低级语言程序（如汇编语言或机器语言程序）的程序。C、PASCAL 等语言的翻译程序就是编译程序。</p>
            <p>按用途与目标机关系，课件列出几类编译程序：</p>
            <table class="tbl">
              <thead><tr><th>类型</th><th>含义</th></tr></thead>
              <tbody>
                <tr><td>诊断编译程序</td><td>用于帮助程序的开发与调试</td></tr>
                <tr><td>优化编译程序</td><td>提高目标代码效率</td></tr>
                <tr><td>交叉编译程序</td><td>产生不同于其宿主机的机器代码</td></tr>
                <tr><td>可变目标编译程序</td><td>不需重写编译程序中与机器无关的部分就能改变目标机</td></tr>
              </tbody>
            </table>
            <p>其中<strong>宿主机</strong>是运行编译程序的机器，<strong>目标机</strong>是产生目标代码的机器。</p>
            <p><strong>解释程序</strong>：把源语言写的源程序作为输入，但不产生目标程序，而是边解释边执行源程序本身（如 BASIC 语言的解释程序）。</p>
            <p>编译与解释的本质区别在于是否生成目标程序：编译程序一次把源程序翻译成目标程序，以后执行目标程序；解释程序不生成目标程序，每次执行都要重新解释源程序。课件用一张对照图说明两者在「源程序 → 结果」链路上的位置差异。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp1-process',
      heading: '1.2 编译过程：五个阶段',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件用「把英文翻译为中文」作类比：识别出句子中的一个个单词（词法分析）→ 分析句子的语法结构（语法分析）→ 根据句子的含义进行初步翻译（中间代码产生）→ 对译文进行修饰（优化）→ 写出最后的译文（目标代码产生）。由此，编译程序的工作一般分为<strong>五个阶段</strong>。</p>
            <p>课件给出的示例 C 程序（其中 <code>y=c+)d*(x+b;</code> 是故意写错的语句）：</p>
            <pre><code>void jisuan()
{   int    y,c,d;
    float  x,a,b;
    x=a+b*50;
    y=c+)d*(x+b;
}</code></pre>
            <p><strong>1. 词法分析</strong>：输入源程序，对构成源程序的字符串进行扫描和分解，识别出一个个单词符号。依循的原则是<strong>构词规则</strong>，描述工具是<strong>正规式和有限自动机</strong>。例如 <code>FOR I := 1 TO 100 DO</code> 被识别为：保留字、标识符、等符、整常数、保留字、整常数、保留字。</p>
            <p>对上述 C 程序，词法分析识别出：基本字（保留字，系统定义好的关键字）<code>void</code>、<code>int</code>、<code>float</code>；标识符（用户定义的函数名、变量名）<code>jisuan</code>、<code>a</code>、<code>b</code>、<code>c</code>、<code>d</code>、<code>x</code>、<code>y</code>；整常数 <code>50</code>；运算符 <code>*</code>、<code>+</code>、<code>=</code>；界限符（分隔开两部分的符号）<code>{</code>、<code>}</code>、<code>;</code>、<code>,</code>、<code>(</code>、<code>)</code>。词法分析依照构词规则识别正确的单词，并转换成统一规格（类号、内码）备用；转换规则包括对基本字、运算符、界限符的转换规则（有限的、可数的），以及对标识符、常数的转换规则等。</p>
            <p><strong>2. 语法分析</strong>：在词法分析的基础上，根据语言的语法规则把单词符号串分解成各类语法单位。依循的原则是<strong>语法规则</strong>，描述工具是<strong>上下文无关文法</strong>。例如 <code>Z := X + 0.618 * Y</code> 被分析为算术表达式、赋值语句。</p>
            <p>课件给出的赋值语句语法规则：</p>
            <pre><code>A → V=E
E → T | E+T
T → F | T*F
F → V | (E) | C
V → 标识符
C → 常数</code></pre>
            <p>语法分析的方法是<strong>推导（derive）</strong>与<strong>归约（reduce）</strong>：推导从开始符号推出句子，包括最左推导、最右推导；归约是推导的逆过程，最左推导对应最右归约，最右推导对应最左归约。对 <code>x=a+b*50;</code> 的最右推导（最右推导即把最右边的非终结符替换）：</p>
            <p><code>A ⇒ V=E ⇒ V=E+T ⇒ V=E+T*F ⇒ V=E+T*C ⇒ V=E+T*50 ⇒ V=E+F*50 ⇒ V=E+V*50 ⇒ V=E+b*50 ⇒ V=T+b*50 ⇒ V=F+b*50 ⇒ V=V+b*50 ⇒ V=a+b*50 ⇒ x=a+b*50</code></p>
            <p>最左推导为：<code>A ⇒ V=E ⇒ x=E ⇒ x=E+T ⇒ x=T+T ⇒ x=F+T ⇒ x=V+T ⇒ x=a+T ⇒ x=a+T*F ⇒ x=a+F*F ⇒ x=a+V*F ⇒ x=a+b*F ⇒ x=a+b*C ⇒ x=a+b*50</code>。而错误的语句 <code>y=c+)d*(x+b</code> 用同样规则<strong>无法推导出</strong>，故判定为语法错误。</p>
            <p><strong>3. 中间代码产生</strong>：对各类不同语法范畴（语句、过程、表达式、函数等）按语言的语义进行初步翻译，依循的原则是<strong>语义规则</strong>。中间代码有三元式、四元式、逆波兰式、树形结构等。例如 <code>Z:=X + 0.618 * Y</code> 翻译成四元式为：</p>
            <table class="tbl">
              <thead><tr><th>序号</th><th>OP</th><th>ARG1</th><th>ARG2</th><th>RESULT</th></tr></thead>
              <tbody>
                <tr><td>(1)</td><td>*</td><td>0.618</td><td>Y</td><td>T1</td></tr>
                <tr><td>(2)</td><td>+</td><td>X</td><td>T1</td><td>T2</td></tr>
                <tr><td>(3)</td><td>:=</td><td>T2</td><td>_</td><td>Z</td></tr>
              </tbody>
            </table>
            <p><strong>4. 优化</strong>：对前一阶段产生的中间代码进行加工变换，以期在最后阶段产生更高效的目标代码。主要包括公共子表达式提取、合并已知量、删除无用语句、循环优化等，依循的原则是<strong>程序的等价变换规则</strong>。</p>
            <p>课件例子：</p>
            <pre><code>FOR K:=1 TO 100 DO
BEGIN
  X:=I+1;
  M := I + 10 * K;
  N := J + 10 * K;
END</code></pre>
            <p>对应的中间代码含 400 次加法、200 次乘法；若把循环化为（C 语言写法）：</p>
            <pre><code>K=1;
10 if (k&lt;=100) then
{  X=I+1;
   M= I + 10 * K;
   N= J + 10 * K;
   K++;
   GOTO 10;
}</code></pre>
            <p>把 <code>M:=I</code>、<code>N:=J</code> 提到循环外，循环内改为 <code>M:=M+10</code>、<code>N:=N+10</code>，则只需 301 次加法，乘法被全部消除——这正是等价变换带来的效率提升。</p>
            <p><strong>5. 目标代码产生</strong>：把中间代码变换成特定机器上的目标代码，依赖于硬件系统结构和机器指令的含义。目标代码有三种形式：绝对指令代码（可直接运行）、可重新定位指令代码（需要连接装配）、汇编指令代码（需要进行汇编）。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp1-structure',
      heading: '1.3 编译程序的结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>编译程序的总体框架由六个部分组成：<strong>词法分析器</strong> → <strong>语法分析器</strong> → <strong>语义分析与中间代码生成器</strong> → <strong>优化段</strong> → <strong>目标代码生成器</strong>，此外还有贯穿全程的<strong>表格管理</strong>与<strong>出错处理</strong>。</p>
            <p><strong>表格管理</strong>：常见的表格有符号名表、常数表、标号表、入口名表、过程引用表，基本格式为「名字 / 信息」两栏。以 PASCAL 程序段为例：</p>
            <pre><code>PROCEDURE INCWAP(M，N:INTEGER);
LABEL  START;
VAR
  K:INTEGER;
BEGIN
START:
  K:=M+1;
  M:=N+4;
  N:=K;
END.</code></pre>
            <p>词法分析时先建好标号表，等到中间代码生成时再把相关信息填入，这体现了表格的「维护管理」贯穿各个阶段。</p>
            <p><strong>出错处理</strong>：出错处理程序发现源程序中的错误并把错误信息报告给用户。错误分为<strong>语法错误</strong>（非法字符、括号不匹配）与<strong>语义错误</strong>（类型不一致）。课件特别指出：编译程序一般很难检测出<strong>逻辑错误</strong>（自相矛盾、偷换概念等）。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp1-pass',
      heading: '1.4 遍、前端与后端',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>遍（pass）</strong>：对源程序或源程序的中间表示从头到尾扫描一次。阶段与遍是不同的概念：一遍可以由若干段组成，一个阶段也可以分若干遍来完成。</p>
            <p><strong>编译前端</strong>：与源语言有关，包括词法分析、语法分析、语义分析与中间代码产生，以及与机器无关的优化。<strong>编译后端</strong>：与目标机有关，包括与目标机有关的优化和目标代码产生。</p>
            <p>这种划分的<strong>优点</strong>是：减少对内存容量的要求，程序逻辑结构清晰；优化更充分，有利于移植。<strong>不足</strong>是编译程序运行的效率低。</p>
            <p>课件的 Java 例子说明了这一结构的价值：Java 编译器只生成与平台无关的中间代码（字节码），由各操作系统平台上的 Java 虚拟机（解释器）执行，从而实现「一次编译、处处运行」。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp1-generate',
      heading: '1.5 编译程序的生成',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>以汇编语言和机器语言为工具</strong>：可以针对具体的机器，充分发挥计算机的系统功能，生成的程序效率高；缺点是程序难读、难写、易出错、难维护，生产效率低。</p>
            <p><strong>用高级语言书写</strong>（如 <code>I: S--&gt;T</code> 表示「用语言 S 书写、产生语言 T 的编译程序」）：程序易读、易理解、容易维护，生产效率高；缺点是难以充分发挥计算机的系统功能，生成的程序效率低。</p>
            <p><strong>自展技术</strong>：先用低级语言（如 L1）写出 L1 的编译程序，再用 L1 写出 L2 的编译程序，逐层递进得到 <code>L1+L2+…+Ln</code> 的编译程序。</p>
            <p><strong>编译程序自动产生</strong>：使用编译程序-编译程序（编译程序书写系统），如 LEX（词法分析程序产生器）、YACC（语法分析程序产生器）。</p>
            <p>构造编译程序的前提是：掌握源语言、掌握目标语言、掌握编译方法。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp1-summary',
      heading: '1.6 小结与课程要求',
      blocks: [
        {
          type: 'html',
          html: `
            <p>本章要求：掌握编译程序的整体架构；掌握编译程序与高级程序设计语言的关系；掌握编译分为哪几个阶段；了解各个阶段完成的主要功能和采用的主要方法。</p>
            <p><strong>课程作用</strong>：编译技术介绍如何将高级程序设计语言变换成计算机硬件能识别的机器语言，以便计算机进行处理；其形式化系统不仅应用于编译技术，而且大量应用于人工智能、多媒体技术及数据库等领域。</p>
            <p><strong>教学目的</strong>：掌握编译原理中的基本概念、基本理论、基本方法；在系统层面再认识程序和算法，提升计算机问题的求解水平，增强系统能力；体验实现自动计算的乐趣，培养计算思维。</p>
            <p><strong>考核方式</strong>：2 次单元测试占 15%（1-3 章、4-5 章），作业占 15%，实验（包括报告）占 20%，课堂演讲（包括课堂、实验）占 10%，期末考试占 40%。</p>
            <p><strong>教材与参考书</strong>：教材为《程序设计语言编译原理（第三版）》（陈火旺主编，国防工业出版社）与《编译原理实验指导书》（李宏芒编）；参考书包括张素琴等《编译原理（第二版）》、蒋宗礼等《编译原理》、Louden《编译原理及实践》、陈英等《编译原理学习指导及习题解析》。</p>`,
        },
      ],
    },
  ],
};

export default ch1;

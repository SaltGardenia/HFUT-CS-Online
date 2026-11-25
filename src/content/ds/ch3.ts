/* 数据结构 · 第3章 栈、队列与递归 —— 依据课件《ch3--栈、队列与递归》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch3',
  no: '第3章',
  title: '栈、队列与递归',
  subtitle: '第 3 章 · 栈、队列与递归',
  lede: `
  栈和队列都是<strong>操作受限的线性表</strong>：栈只允许在同一端插入和删除，队列在一端插入、另一端删除。
  本章讨论它们的逻辑结构、顺序/链式存储实现与典型应用，最后说明栈与<strong>递归</strong>的关系。
`,
  toc: [
    { id: 'sec-ds3-stack', text: '1. 栈', level: 2 },
    { id: 'sec-ds3-queue', text: '2. 队列', level: 2 },
    { id: 'sec-ds3-rec', text: '3. 栈与递归', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds3-stack',
      heading: '1. 栈',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>栈</strong>是限定仅在表尾（称为<strong>栈顶</strong>）进行插入和删除的线性表。允许操作的一端为栈顶（top），另一端为<strong>栈底</strong>（bottom）。插入称<strong>入栈</strong>（push），删除称<strong>出栈</strong>（pop）。</p>
          <p>栈的显著特点是<strong>后进先出</strong>（LIFO，Last In First Out）：最后入栈的元素最先出栈。n 个不同元素依次入栈，可能的出栈序列共有 <strong>C<sub>2n</sub><sup>n</sup>/(n+1)</strong> 种（卡特兰数）。</p>
          <h3 id="sec-ds3-stack-h1">顺序栈</h3>
          <p>用一维数组存放栈元素，另设栈顶指针 top 指向栈顶元素。约定 top = −1 表示空栈；入栈时 top 加 1 后写入，出栈时先取元素再让 top 减 1。</p>
          <pre class="code"><code>#define MAXSIZE 100
typedef struct {
    ElemType data[MAXSIZE];
    int top;                 // 栈顶下标，空栈为 -1
} SqStack;

int Push(SqStack *S, ElemType e)
{
    if (S-&gt;top == MAXSIZE - 1) return 0;   // 栈满
    S-&gt;data[++S-&gt;top] = e;
    return 1;
}

int Pop(SqStack *S, ElemType *e)
{
    if (S-&gt;top == -1) return 0;            // 栈空
    *e = S-&gt;data[S-&gt;top--];
    return 1;
}</code></pre>
          <p>顺序栈的入栈、出栈都在栈顶进行，时间均为 O(1)。由于数组容量固定，需判满；也可用两个栈共享一个数组，从两端向中间增长。</p>
          <h3 id="sec-ds3-stack-h2">链栈</h3>
          <p>链栈用单链表实现，通常<strong>不带</strong>头结点，链表的头部就是栈顶：入栈即头插，出栈即删除首结点，均为 O(1)。链栈没有栈满问题，但每个结点需要额外指针域。</p>
          <pre class="code"><code>typedef struct SNode {
    ElemType data;
    struct SNode *next;
} SNode, *LinkStack;

int Push(LinkStack *S, ElemType e)          // 头插
{
    SNode *p = (SNode *)malloc(sizeof(SNode));
    if (!p) return 0;
    p-&gt;data = e;
    p-&gt;next = *S;
    *S = p;
    return 1;
}</code></pre>
          <h3 id="sec-ds3-stack-h3">栈的应用</h3>
          <ul>
            <li><strong>括号匹配</strong>：遇左括号入栈，遇右括号与栈顶比较，匹配则出栈；扫描结束栈空则合法。</li>
            <li><strong>表达式求值</strong>：操作数栈 + 运算符栈；或先把中缀表达式转成后缀表达式，再顺序求值。</li>
            <li><strong>数制转换</strong>：十进制转 k 进制，每次取余入栈，最后依次出栈即为结果。</li>
            <li><strong>递归的实现</strong>：函数调用与返回由系统栈保存返回地址、参数与局部变量。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ds3-queue',
      heading: '2. 队列',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>队列</strong>是只允许在一端（<strong>队尾</strong> rear）插入、在另一端（<strong>队头</strong> front）删除的线性表。插入称入队，删除称出队，特点是<strong>先进先出</strong>（FIFO）。</p>
          <h3 id="sec-ds3-queue-h1">顺序队列与循环队列</h3>
          <p>用数组存放队列，front 指向队头元素、rear 指向队尾元素的下一个位置。随着入队、出队，front 与 rear 不断后移，前面空出的单元无法再利用，出现<strong>假溢出</strong>。</p>
          <p>解决办法是把数组看成首尾相接的<strong>循环队列</strong>，指针移动用取模实现：</p>
          <div class="formula">front = (front + 1) % MAXSIZE；rear = (rear + 1) % MAXSIZE</div>
          <p>为区分队空与队满，常用<strong>少用一个存储单元</strong>的办法：队空条件 front == rear，队满条件 (rear + 1) % MAXSIZE == front。此时队列最多存放 MAXSIZE − 1 个元素。</p>
          <pre class="code"><code>#define MAXSIZE 100
typedef struct {
    ElemType data[MAXSIZE];
    int front, rear;         // 队头下标、队尾下一位置
} SqQueue;

int EnQueue(SqQueue *Q, ElemType e)
{
    if ((Q-&gt;rear + 1) % MAXSIZE == Q-&gt;front) return 0;  // 队满
    Q-&gt;data[Q-&gt;rear] = e;
    Q-&gt;rear = (Q-&gt;rear + 1) % MAXSIZE;
    return 1;
}

int DeQueue(SqQueue *Q, ElemType *e)
{
    if (Q-&gt;front == Q-&gt;rear) return 0;                   // 队空
    *e = Q-&gt;data[Q-&gt;front];
    Q-&gt;front = (Q-&gt;front + 1) % MAXSIZE;
    return 1;
}</code></pre>
          <p>循环队列入队、出队均为 O(1)。队列长度可用 (rear − front + MAXSIZE) % MAXSIZE 计算。</p>
          <h3 id="sec-ds3-queue-h2">链队列</h3>
          <p>链队列用单链表实现，设队头指针 front 与队尾指针 rear。为方便操作，通常带头结点：front 指向头结点，rear 指向队尾结点。入队在表尾插入并修改 rear；出队删除首元结点，若删除后队列为空，还要令 rear = front。</p>
          <p>链队列不存在队满问题，入队、出队均为 O(1)。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds3-rec',
      heading: '3. 栈与递归',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>递归</strong>：一个函数直接或间接地调用自身。递归必须满足两个条件：</p>
          <ul>
            <li><strong>递归出口</strong>（边界条件）：存在一个或多个无需继续递归即可求解的情形；</li>
            <li><strong>递归体</strong>：把原问题分解为规模更小的同类子问题，且每次向出口靠近。</li>
          </ul>
          <p>以阶乘为例：</p>
          <div class="formula">n! = 1 (n = 0)；n! = n × (n − 1)! (n &gt; 0)</div>
          <p>递归的执行依赖<strong>递归工作栈</strong>：每次调用把返回地址、实参、局部变量压入栈；返回时弹出并恢复现场。因此递归深度决定辅助空间大小，递归算法的时间分析要写出递推关系。</p>
          <div class="formula">T(n) = T(n − 1) + O(1) ⇒ T(n) = O(n)（阶乘、汉诺塔的移动次数为 2<sup>n</sup> − 1）</div>
          <p>递归程序结构清晰、易于证明正确性，但可能因重复计算与栈开销而低效；必要时可改写为<strong>迭代</strong>，或把递归栈显式地用栈结构模拟。</p>
          <div class="callout key">
            <p class="callout-h">栈与递归的关系</p>
            <p>递归是栈的典型应用：系统用栈保存调用现场，使「后调用先返回」得以实现。理解这一点，就能把任意递归算法改写成非递归算法。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

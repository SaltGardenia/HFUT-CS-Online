/* 第2章 对称密码学 —— 逐页转录自 课件/PPT/第2章 对称密码学.pdf（76 页，全文提取 + 蒙太奇/放大裁剪核对）；
   ECB 加密示例的十六进制数据、ZUC 的 LFSR/BR/F 公式均按放大页逐式转录（BR 公式与标准 ZUC 定义不同，照录）；
   PDF 物理页序与页脚页码存在错位（"注意 ZUC-128/256"页显示第77页、非线性函数(F)页显示第76页），按内容顺序整理；
   纯图页（密码学基本模型图、工具箱图、莫尔斯码表、凯撒/替换密码连线图、Enigma 结构图、Feistel/AES 各步骤图、
   DH 交换示意图、PBE 流程图、RC4/ZUC 结构图）以（课件图示 …）标注。 */
import type { SecChapter } from './types';

const ch2: SecChapter = {
  id: 'deck2',
  no: '第2章',
  title: '对称密码学',
  subtitle: '密码学基本概念 · 历史上的密码 · 一次性密码本与 Enigma · DES / 3DES · AES（Rijndael）· 分组密码模式 · Diffie-Hellman · 基于口令的密码 · 流密码（RC4 / ZUC）',
  lede:
    '<p>本章内容：2.1 密码学的基本概念（算法、明文、密文、密钥，对称/非对称密码，其他密码技术，密码学家的工具箱，信息隐藏，密码与信息安全常识）、2.2 历史上的密码（莫尔斯密码、古斯巴达人"天书"、凯撒密码、简单替换密码）、2.3 从文字到比特序列密码（编码与异或、一次性密码本、Enigma）、2.4 DES（Feistel 网络、3DES）、2.5 AES（Rijndael 的字节替换/平移行/混合列/轮密钥加）、2.6 分组密码的模式（ECB/CBC/CFB）、2.7 密钥配送问题与 Diffie-Hellman 密钥交换、2.8 基于口令的密码（PBE 与盐）、流密码（RC4、祖冲之密码 ZUC）。</p>',
  toc: [
    { id: 'sec-sec2-basics', text: '2.1 密码学的基本概念', level: 2 },
    { id: 'sec-sec2-history', text: '2.2 历史上的密码', level: 2 },
    { id: 'sec-sec2-bits', text: '2.3 从文字到比特序列密码（一次性密码本、Enigma）', level: 2 },
    { id: 'sec-sec2-des', text: '2.4 DES 与 3DES', level: 2 },
    { id: 'sec-sec2-aes', text: '2.5 AES（Rijndael）', level: 2 },
    { id: 'sec-sec2-modes', text: '2.6 分组密码的模式', level: 2 },
    { id: 'sec-sec2-dh', text: '2.7 密钥配送问题与 Diffie-Hellman 密钥交换', level: 2 },
    { id: 'sec-sec2-pbe', text: '2.8 基于口令的密码', level: 2 },
    { id: 'sec-sec2-stream', text: '流密码：RC4 与祖冲之密码（ZUC）', level: 2 },
  ],
  sections: [
    {
      id: 'sec-sec2-basics',
      heading: '2.1 密码学的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>2.1 密码学的基本概念</strong></p>
            <ul>
              <li><strong>算法（Algorithm）</strong>：解决复杂问题的步骤——加密算法、解密算法</li>
              <li><strong>明文（Plaintext）</strong>：须要加密的消息或数据，是加密算法的输入。</li>
              <li><strong>密文（Ciphertext）</strong>：加密之后的数据，是加密算法的输出。</li>
              <li><strong>密钥（Key）</strong>：加密或解密的参数。不同的密钥，会有不同的输出结果。</li>
            </ul>
            <p><strong>加密（Encryption）</strong>：将明文变成密文的过程。C = E<sub>K</sub>(P)，K 是密钥，P 是明文，C 是密文，E 是加密算法。</p>
            <p><strong>解密（Decryption）</strong>：将密文恢复成明文的过程。P = D<sub>K</sub>(C)，D 是解密算法。</p>
            <p>（课件图示：Alice（发送者）→ 邮件（消息）→ Bob（接收者）通信模型图）</p>
            <p>将消息加密发出后，窃听者只能得到密文。（课件图示：Eve（窃听者）只能获得密文的通信模型图）</p>
            <p><strong>2.1 对称密码</strong>：对称密码是指加密和解密时使用同一把密钥的方式。</p>
            <p><strong>2.1 非对称密码（公钥密码）</strong>：非对称密码是指加密和解密时使用不同密钥的方式。</p>
            <p><strong>2.1 其他密码技术</strong></p>
            <ul>
              <li><strong>单项散列函数（one-way hash function）</strong>：检测数据是否被篡改过，保证数据的完整性。</li>
              <li><strong>消息认证码（message authentication code）</strong>：不仅能检测消息是否被篡改，而且能确认消息是否来自于所期待的通信对象，提供认证机制。</li>
              <li><strong>数字签名（digital signature）</strong>：保证完整性、提供认证且防止否认。</li>
              <li><strong>伪随机数生成器</strong>：模拟产生随机数的算法，承担密钥生成的重要职责。</li>
            </ul>
            <p><strong>2.1 密码学家的工具箱</strong>（课件图示：信息安全所构成的威胁与对应的密码技术——窃听→机密性→对称密码/公钥密码；篡改→完整性→单向散列函数；伪装→认证→消息认证码；否认→不可否认性→数字签名）</p>
            <p><strong>2.1 信息隐藏（隐写）</strong></p>
            <p>现代的信息隐藏常将秘密信息藏于多媒体文件（如视频、图片）中。隐写与水印。（课件演示文本："我们先准备一段话，很容易看懂就可以。喜闻乐见的当然更好。欢迎你尝试将另一句话嵌在这段话中，你会发现这其实就是一种隐写术。"）</p>
            <p><strong>2.1 密码与信息安全常识</strong></p>
            <ul>
              <li>不要使用保密的密码算法</li>
              <li>开发高强度的密码算法是非常困难的</li>
              <li>任何密码总要一天都会被破解</li>
              <li>密码只是信息安全的一部分</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-sec2-history',
      heading: '2.2 历史上的密码',
      blocks: [
        {
          type: 'html',
          html: `
            <p>（课件图示：莫尔斯密码表——由点 di（·）、划 da（−）两种符号按规则组成；I LOVE YOU 即 .. / .-.. --- ...- . -.-- --- ..-）</p>
            <p>（课件图示：500 B.C. 古斯巴达人使用的"天书"——将纸条缠绕在木棒上书写以加密）</p>
            <p><strong>凯撒密码</strong></p>
            <p>恺撒密码（Caesar cipher）是一种相传尤利乌斯•恺撒曾使用过的密码。恺撒于公元前 100 年左右诞生于古罗马，是一位著名的军事统帅。</p>
            <p>恺撒密码是通过将明文中所使用的字母表按照一定的字数 "平移" 来进行加密的。</p>
            <p>（课件图示：凯撒密码加密/解密示意图——密钥为 3，yowhko 加密为 BRYXLUR，解密方向相反）</p>
            <p><strong>凯撒密码的破译？</strong></p>
            <p><strong>简单替换密码</strong>：将明文中所使用的字母替换成另一套字母表的密码。（课件图示：字母替换连线图与"将左边表改变成更复杂的模式"的替换表）</p>
            <p><strong>简单替换密码的破译？</strong></p>
            <ul>
              <li>庞大的密钥空间（26！）</li>
              <li>难以用暴力破解来破译</li>
              <li>思考：如何破解？</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-sec2-bits',
      heading: '2.3 从文字到比特序列密码（一次性密码本、Enigma）',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>2.3 从文字到比特序列密码</strong></p>
            <p><strong>编码</strong>：将字母数字等映射为比特序列（ASCII）。</p>
            <p><strong>异或（XOR）</strong></p>
            <pre class="code">0 XOR 0 = 0   （0 与 0 的 XOR 结果为 0）
0 XOR 1 = 1   （0 与 1 的 XOR 结果为 1）
1 XOR 0 = 1   （1 与 0 的 XOR 结果为 1）
1 XOR 1 = 0   （1 与 1 的 XOR 结果为 0）</pre>
            <p>比特序列的异或（课件图示：01001110 XOR 10101010 = 11100100 的逐位异或演示与交换值 a⊕b 的性质）</p>
            <p><strong>2.3 一次性密码本</strong></p>
            <p>将明文与一串随机的比特序列进行 XOR 运算。加密、解密过程见下图。（课件图示：明文→密文→明文的一次性密码本加解密示例）</p>
            <ul>
              <li>一次性密码本是由维纳（G.S. Vernam）于1917年提出，因此又称维纳密码。</li>
              <li>一次性密码本是无法破解的——无法判断它是否是正确的明文。</li>
              <li>一次性密码本无法破解这一特性由香农（C.E.Shannon）于1949年通过数学方法加以证明的。</li>
              <li>一次性密码本是无条件安全的、在理论上是无法破译的。</li>
            </ul>
            <p>思考：为什么一次性密码本没有被使用？</p>
            <p><strong>为什么一次性密码本没有被使用？</strong></p>
            <ul>
              <li>密钥的配送</li>
              <li>密钥压缩是否可行？如果不可行，会造成什么问题？</li>
              <li>密钥的保存</li>
              <li>密钥的重用（密钥不能重复）</li>
              <li>密钥的同步（密钥错位）</li>
              <li>密钥的生成（随机性）</li>
            </ul>
            <p><strong>2.3 Enigma</strong></p>
            <p>Enigma 是由德国工程师阿瑟•谢尔比乌斯（Arthur Scherbius）于 20 世纪初发明的一种可进行加密与解密操作的机械密码设备。</p>
            <p>通过引入可旋转转子结构与电路连接机制，构建出一种能够生成高度复杂替换密码的加密系统，其安全强度远超当时人工手工加密方式所能达到的水平。</p>
            <p>Enigma 在问世初期主要应用于商业通信领域，随后在纳粹德国时期被德国国防军采用，并在原有基础上进行改进和强化，广泛应用于军事通信加密之中。</p>
            <p>（课件图示：Enigma 结构示意图——键盘/输入、接线板、转子 1–3、反射器；战争密码（上集）如何复刻一台恩格玛机：<a href="https://www.bilibili.com/video/BV1DS4y1R7hM/">视频链接（B 站）</a>）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec2-des',
      heading: '2.4 DES 与 3DES',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>2.4 DES</strong></p>
            <p>DES（Data Encryption Standard）是1977 年美国联邦信息处理标准（FIPS）中所采用的一种对称密码（FIPS 46-3）。DES一直以来被美国以及其他国家的政府和银行等广泛使用。</p>
            <p>随着计算机的进步，现在DES 已经能够被暴力破解，强度大不如前了。1999年的DES Challenge 中只用了22 小时 15 分钟。</p>
            <p>由于DES 的密文可以在短时间内被破译，因此除了用它来解密以前的密文以外，现在我们不应该再使用 DES。</p>
            <p>DES 是一种将64比特的明文加密成64比特的密文的对称密码算法，它的密钥长度是 56比特。尽管从规格上来说，DES 的密钥长度是 64 比特，但由于每隔7比特会设置一个用于错误检查的比特，因此实质上其密钥长度是 56比特。</p>
            <p>DES 是以64比特的明文（比特序列）为一个单位来进行加密的，这个64比特的单位称为分组。一般来说，以分组为单位进行处理的密码算法称为<strong>分组密码（block cipher）</strong>，DES 就是分组密码的一种。</p>
            <p><strong>2.4 DES的结构</strong></p>
            <ul>
              <li>DES 的基本结构是由 Horst Feistel 设计的，因此也称为 Feistel 网络（Feistel network）。</li>
              <li>在Feistel 网络中，加密的各个步骤称为<strong>轮（round）</strong>，整个加密过程就是进行若干次轮的循环。</li>
              <li>DES 是一种16轮循环的 Feistel 网络，每轮需要使用一个不同的子密钥。</li>
              <li>3轮加密2次左右对调。（课件图示：Feistel 网络 3 轮加密结构图）</li>
              <li>解密：根据XOR的性质，用相同的子密钥运行2次Feistel网络就能将数据还原。</li>
            </ul>
            <p><strong>总结</strong></p>
            <ul>
              <li>Feistel网络的轮数可以任意增加。</li>
              <li>加密时无论使用任何函数作为轮函数都可以正确解密。</li>
              <li>加密和解密可以使用相同的结构来实现。</li>
              <li>DES算法已经可以在现实的时间内被暴力破解。</li>
            </ul>
            <p>如何增加DES的复杂程度使得难以破解？</p>
            <p><strong>2.4 3DES</strong></p>
            <ul>
              <li>为了增加DES的强度，将DES重复3次所得到的一种密码算法。</li>
              <li>3DES密钥的长度是56x3=168比特。</li>
              <li>如果密钥使用相同，相当于DES。</li>
              <li>处理效率不高。</li>
            </ul>
            <p>（课件图示：3DES 加密流程示意图——加密/DES-EDE 三次运算）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec2-aes',
      heading: '2.5 AES（Rijndael）',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>2.5 AES</strong></p>
            <p>AES（Advanced Encryption Standard）是取代其前任标准（DES）而成为新标准的一种对称密码算法。全世界的企业和密码学家提交了多个对称密码算法作为 AES 的候选，最终在 2000年从这些候选算法中选出了一种名为 Rijndael 的对称密码算法，并将其确定为了 AES。</p>
            <p>参加的条件就是：被选为 AES 的密码算法必须无条件地免费供全世界使用。</p>
            <p>参加者还必须提交密码算法的详细规格书、以 ANSI C和Java 编写的实现代码以及抗密码破译强度的评估等材料。因此，参加者所提交的密码算法，必须在详细设计和程序代码完全公开的情况下，依然保证较高的强度，这就彻底杜绝了隐蔽式安全性。</p>
            <p><strong>2.5 AES（Rijndael）</strong></p>
            <ul>
              <li>Rijndael 是由比利时密码学家 Joan Daemen 和 Vincent Rijmen 设计的分组密码算法，2000 年被选为新一代的标准密码算法AES。今后会有越来越多的密码软件支持这种算法。</li>
              <li>Rijndael 的分组长度和密钥长度可以分别以 32 比特为单位在 128 比特到 256 比特的范围内进行选择。不过在 AES 的规格中，分组长度固定为 128 比特，密钥长度只有128、192 和 256比特三种。</li>
              <li>Rijndael 算法也是由多个轮构成的，其中每一轮分为<strong>字节替换（SubBytes）、平移行（ShiftRows）、混合列（MixColumns）和轮密钥加（AddRoundKey）</strong>共4个步骤。Rindael没有使用 Feistel 网络，而是使用了 SPN 结构。</li>
            </ul>
            <p><strong>字节替换</strong>：Rijndael 的输入分组为 128 比特，也就是16字节。首先，需要逐个字节地对 16字节的输入数据进行字节替换处理，是以每个字节的值（0~255 的任意值）为索引，从一张拥有 256个值的替换表（S-Box）中查找出对应值的处理。也就是说，要将一个1字节的值替换成另一个1字节的值。（课件图示：S-Box 字节替换示意）</p>
            <p><strong>平移行</strong>：平移行是指将以4字节为单位的行（row）按照一定的规则向左平移，且每一行平移的字节数是不同的。（课件图示：4×4 状态矩阵按行左移示意）</p>
            <p><strong>混合列</strong>：混合列是对一个4字节的值进行比特运算，将其变为另外一个4字节值。（课件图示：列混合运算示意）</p>
            <p><strong>轮密钥加</strong>：需要将混合列的输出与轮密钥进行 XOR，即进行轮密钥加处理。实际上，在Rijndael 中需要重复进行 10~14 轮计算。（课件图示：轮密钥加 XOR 示意）</p>
            <p><strong>AES 的特点</strong></p>
            <ul>
              <li>输入比特在一轮中都会被加密</li>
              <li>加密轮数比Feistel网络少（AES: 10-14; Feistel: 16）</li>
              <li>一轮中的操作可并行处理</li>
              <li>解密采取相反的步骤</li>
              <li>加密：字节替换 → 平移行 → 混合列 → 轮密钥加</li>
              <li>解密：轮密钥加 → 逆混合列 → 逆平移行 → 逆字节替换</li>
              <li>有严格的数学表达与计算</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-sec2-modes',
      heading: '2.6 分组密码的模式',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>2.6 分组密码的模式</strong></p>
            <p>DES 和 AES 都属于分组密码，它们只能加密固定长度的明文。如果需要加密任意长度的明文，就需要对分组密码进行迭代，而分组密码的迭代方法就称为分组密码的"模式"。</p>
            <p>密码算法可以分为分组密码和流密码两种。</p>
            <p><strong>分组密码（block cipher）</strong>是每次只能处理特定长度的一块数据的一类密码算法，这里的一块就称为分组（block）。此外，一个分组的比特数就称为分组长度。</p>
            <p>DES 和3DES 的分组长度都是64 比特。这些密码算法一次只能加密 64 比特的明文，并生成 64 比特的密文。</p>
            <p><strong>流密码（stream cipher）</strong>是对数据流进行连续处理的一类密码算法，流密码中一般以1比特8比特或 32比特等为单位进行加密和解密。</p>
            <p>分组密码处理完一个分组就结束了，因此不需要通过内部状态来记录加密的进度；相对的，流密码是对一串数据流进行连续处理，因此需要保持内部状态。</p>
            <p>思考：最简单的分组方案？</p>
            <p><strong>ECB（Electronic CodeBook）模式</strong>：将明文分组加密之后的结果将直接成为密文分组。</p>
            <ul>
              <li>使用 ECB 模式加密时，组成"明文分组—密文分组"的对应表，因此 ECB 模式也称为<strong>电子密码本模式</strong>。</li>
              <li>当最后一个明文分组的内容小于分组长度时，需要用一些特定的数据进行填充（padding）。</li>
            </ul>
            <p>思考：ECB模式是否安全？</p>
            <p>假如存在主动攻击者，他能够改变密文分组的顺序。当接收者对密文进行解密时，由于密文分组的顺序被改变了，因此相应的明文分组的顺序也会被改变。也就是说，<strong>攻击者无需破译密码就能够操纵明文</strong>。</p>
            <p>下面以转账为例：分组1 = 付款人的银行账号，分组2 = 收款人的银行账号，分组3 = 转账金额。</p>
            <p>使用 ECB 模式进行加密（课件原文十六进制数据转录）：</p>
            <pre class="code">明文分组1 = 41 2D 35 33 37 34 20 20 20 20 20 20 20 20 20 20（付款人：A-5374）
明文分组2 = 42 2D 36 36 37 31 20 20 20 20 20 20 20 20 20 20（收款人：B-6671）
明文分组3 = 31 30 30 30 30 30 30 30 20 20 20 20 20 20 20 20（转账金额：10000000）

密文分组1 = 59 7D DE CC EF EC BA 9B BF 83 99 CF 60 D2 59 B9（付款人：????）
密文分组2 = DF 49 2A 1C 14 8E 18 B6 53 1F 38 BD 5A A9 D7 D7（收款人：????）
密文分组3 = CD AF D5 9E 39 FE FD 6D 64 8B CC CB 52 56 8D 79（转账金额：????）</pre>
            <p>将密文分组1和2的内容对调：</p>
            <pre class="code">密文分组1 = DF 49 2A 1C 14 8E 18 B6 53 1F 38 BD 5A A9 D7 D7（付款人：????）
密文分组2 = 59 7D DE CC EF EC BA 9B BF 83 99 CF 60 D2 59 B9（收款人：????）
密文分组3 = CD AF D5 9E 39 FE FD 6D 64 8B CC CB 52 56 8D 79（转账金额：????）</pre>
            <p><strong>CBC 模式</strong>的全称是 Cipher Block Chaining 模式（密文分组链接模式）。在CBC 模式中，首先将明文分组与前一个密文分组进行 XOR 运算，然后再进行加密。</p>
            <p>ECB 模式只进行了加密，而CBC模式则在加密之前进行了一次 XOR。</p>
            <p><strong>CFB 模式</strong>的全称是 Cipher FeedBack 模式（密文反馈模式）。在CFB 模式中，前一个密文分组会被送回到密码算法的输入端。</p>
            <p>CBC 模式中，明文分组都是通过密码算法进行加密的，然而在CFB 模式中，明文分组并没有通过密码算法来直接进行加密。在CFB模式中，明文分组和密文分组之间只有一个 XOR，明文分组和密文分组之间并没有经过"加密"这一步骤。</p>
            <ul>
              <li>CFB模式的结构与一次性密码本是非常相似的。</li>
              <li>在 CFB 模式中，密码算法的输出相当于一次性密码本中的随机比特序列。由于密码算法的输出是通过计算得到的，并不是真正的随机数，因此 CFB 模式不可能像一次性密码本那样具备理论上不可破译的性质。</li>
              <li>CFB 模式中由密码算法所生成的比特序列称为<strong>密钥流（key stream）</strong>。</li>
              <li>在CFB模式中，明文数据可以被逐比特加密，因此我们可以将 CFB 模式看作是一种使用分组密码来实现流密码的方式。</li>
            </ul>
            <p>（课件图示：ECB/CBC/CFB 三种模式的结构示意图与 ECB/CBC 对比图）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec2-dh',
      heading: '2.7 密钥配送问题与 Diffie-Hellman 密钥交换',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>2.7 密钥配送问题</strong>：如何安全地将密钥分发给需要解密的人？（课件图示：密钥配送问题示意图）</p>
            <p><strong>2.7 Diffie-Hellman 密钥交换</strong></p>
            <p>Diffie-Hellman 密钥交换（Diffie-Hellman key exchange）是 1976年由 Whitfield Diffie 和 Martin Hellman 共同发明的一种算法。使用这种算法，通信双方仅通过交换一些可以公开的信息就能够生成出共享的秘密数字，而这一秘密数字就可以被用作对称密码的密钥。IPsec 中就使用了经过改良的 Diffie-Hellman 密钥交换。</p>
            <p>虽然这种方法的名字叫"密钥交换"，但实际上双方并没有真正交换密钥，而是通过计算生成出了一个相同的共享密钥。因此，这种方法也称为 Diffie-Hellman 密钥协商（Diffie-Hellman key agreement）。</p>
            <ol>
              <li>Alice 向 Bob 发送两个质数 P 和 G。P 必须是一个非常大的质数，而 G 则是一个和 P 相关的数，称为<strong>生成元（generator）</strong>。G 可以是一个较小的数字。P 和 G 不需要保密，被窃听者获取也没关系。P 和 G 可以由 Alice 和 Bob 中的任意一方生成。</li>
              <li>Alice 生成一个随机数 A——A 是一个 1~P-2 之间的整数。这个数是一个只有 Alice 知道的秘密数字。</li>
              <li>Bob 生成一个随机数 B——B 是一个 1~P-2 之间的整数。这个数是一个只有 Bob 知道的秘密数字。</li>
              <li>Alice 将 G^A mod P 这个数发送给 Bob——被窃听也没关系。</li>
              <li>Bob 将 G^B mod P 这个数发送给 Alice——被窃听也没关系。</li>
              <li>Alice 用 Bob 发过来的数计算 A 次方并求 mod P。</li>
              <li>Bob 用 Alice 发过来的数计算 B 次方并求 mod P。</li>
            </ol>
            <p>Alice 计算的密钥 = Bob 计算的密钥</p>
            <p>窃听者所知道的数据：P, G, G^A mod P, G^B mod P。根据以上4个数求解 G^(A*B) mod P 是非常困难的。有限域的离散对数问题的复杂度是支撑 Diffie-Hellman 密钥交换算法的基础。</p>
            <p><strong>2.7 Diffie-Hellman 密钥交换举例</strong></p>
            <ol>
              <li>Alice 向 Bob 发送两个质数 P 和 G：P=13, G=2</li>
              <li>Alice 生成一个随机数 A=9</li>
              <li>Bob 生成一个随机数 B=7</li>
              <li>Alice 将 G^A mod P 这个数发送给 Bob：2^9 mod 13 = 5</li>
              <li>Bob 将 G^B mod P 这个数发送给 Alice：2^7 mod 13 = 11</li>
              <li>Alice 用 Bob 发过来的数 11 计算 A 次方并求 mod P：8</li>
              <li>Bob 用 Alice 发过来的数 5 计算 B 次方并求 mod P：8</li>
            </ol>
            <p>通过上述步骤，Alice 和 Bob 就各自计算出了相等的数 8 作为共享密钥。</p>
            <p>（课件图示：Diffie-Hellman 密钥交换各步骤的双方状态示意图）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec2-pbe',
      heading: '2.8 基于口令的密码',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>2.8 基于口令的密码</strong></p>
            <p>基于口令的密码（Password Based Encryption, PBE）是一种根据口令生成密钥并用该密钥进行加密的方法。其中加密和解密使用同一个密钥。</p>
            <p><strong>PBE加密包含三步</strong>：生成密钥 KEK；生成会话密钥并加密；加密消息。</p>
            <p><strong>PBE解密包含三步</strong>：重建 KEK；解密会话密钥；解密消息。</p>
            <p><strong>盐的作用：防御字典攻击</strong>——字典攻击是一种事先进行计算并准备好候选密钥列表的方法。（课件图示：PBE 加解密流程图与盐值/字典攻击示例表）</p>`,
        },
      ],
    },
    {
      id: 'sec-sec2-stream',
      heading: '流密码：RC4 与祖冲之密码（ZUC）',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>流密码</strong></p>
            <ul>
              <li>序列密码，对称密码的一种，实现简单。</li>
              <li>原理：将明文划分成字符（如单个字母），或其编码的基本单元（如 0，1 数字），字符分别与密钥流作用进行加密，解密时以同步产生的同样的密钥流实现。</li>
            </ul>
            <p>安全性：</p>
            <ul>
              <li>流密码强度完全依赖于密钥序列的随机性和不可预测性；</li>
              <li>核心问题是密钥流生成器的设计；</li>
              <li>保持收发两端密钥流的精确同步是实现可靠解密的关键技术。</li>
            </ul>
            <p><strong>RC4</strong></p>
            <ul>
              <li>RC4是大名鼎鼎的RSA三人组中的头号人物 RonRivest 在1987年设计的密钥长度可变的流加密算法。</li>
              <li>该算法的速度可以达到DES加密的10倍左右，且具有很高级别的非线性。</li>
              <li>一个字节一个字节进行加密。</li>
              <li>优点：简单灵活，速度快；缺点：安全性低，容易破解。</li>
            </ul>
            <p>以一个足够大的数据表为基础，对表进行非线性变化，产生非线性的密钥序列。基于非线性数据表的序列密钥（置换密码）。</p>
            <p><strong>算法流程</strong>：初始化S表 → 生成密钥流 → 密钥流与明文异或。</p>
            <p><strong>初始化S表</strong></p>
            <pre class="code">对S表线性填充，如:
S[0]=0, S[1]=1, S[2]=2, ..., S[255]=255
用种子密钥填充另外一个K表:
K[0], K[1], K[2], ..., K[255]
j=0;
For i=0 to 255
  j=j+S[i]+K[i] mod 256
  Swap (S[i],S[j]);
S表一旦初始完成，种子密钥就不再使用了</pre>
            <p>举例（课件按 mod 7 简化演示）:</p>
            <pre class="code">j=0;
For i=0 to 255
  j=j+S[i]+K[i] mod 7
  Swap (S[i],S[j]);</pre>
            <p>（课件图示：RC4 初始化 S 表示例——S 表线性填充 0~6、K 表按种子密钥填充、按上述规则交换后得到打乱后的 S 表）</p>
            <p><strong>生成密钥流</strong></p>
            <ul>
              <li>为每个待加密的字节生成一个用来异或的随机数值</li>
              <li>循环执行状态转移和输出</li>
            </ul>
            <pre class="code">i, j = 0;
For r = 0 to len          // r 为明文字节数
  i = (i + 1) mod 256
  j = (j + S[i]) mod 256
  swap (S[i], S[j])       // 状态转移
  t := S[(S[i] + S[j]) mod 256]   // 作为 T
  K[r] = S[t];            // 输出</pre>
            <p><strong>安全性分析</strong></p>
            <ul>
              <li>RC4衍生出了多个变种算法，如RC4A、RC4X和RC4S等。</li>
              <li>主要依赖于密钥长度，但是由于RC4算法的密钥流生成过程中存在循环依赖，因此当密钥长度较短时，密钥流的周期较短，容易被暴力破解。</li>
              <li>RC4算法存在相关密钥攻击、明文攻击等问题。</li>
            </ul>
            <p><strong>3.3 祖冲之密码（ZUC）</strong></p>
            <ul>
              <li>中国自主研制的流密码算法，被设计用于 4G网络及以上的通信系统中。</li>
              <li>GB/T 33133.1-2016</li>
            </ul>
            <p><strong>流程</strong>：线性反馈移位寄存器（LFSR）→ 比特重组（BR）→ 非线性函数（F）。（课件图示：ZUC 算法整体结构图）</p>
            <p><strong>线性反馈移位寄存器（LFSR）</strong></p>
            <ul>
              <li>LFSR包括16个31比特寄存器单元 S0-S15。</li>
              <li>LFSR的运行模式有两种：初始化模式和工作模式。</li>
              <li>初始化模式：接收一个31比特的输入 u，对 S0-S15 进行更新。</li>
              <li>工作模式：无输入，直接更新寄存器单元。</li>
            </ul>
            <pre class="code">初始化模式:
(1) v = 2^15·s15 + 2^17·s13 + 2^21·s10 + 2^20·s4 + (1+2^8)·s0 mod (2^31 − 1);
(2) s16 = (v + u) mod (2^31 − 1);
(3) 如果 s16 = 0，则置 s16 = 2^31 − 1;
(4) (s1, s2, …, s15, s16) → (s0, s1, …, s14, s15)。

工作模式:
(1) s16 = 2^15·s15 + 2^17·s13 + 2^21·s10 + 2^20·s4 + (1+2^8)·s0 mod (2^31 − 1);
(2) 如果 s16 = 0，则置 s16 = 2^31 − 1;
(3) (s1, s2, …, s15, s16) → (s0, s1, …, s14, s15)。</pre>
            <p><strong>比特重组（BR）</strong>：输入为寄存器单元 S0-S15，输出为 4 个 32 比特字 X0，X1，X2，X3。</p>
            <pre class="code">BitReconstruction()
{
  (1) X0 = s15H ‖ s14L;
  (2) X1 = s11L ‖ s9H;
  (3) X2 = s7L ‖ s5H;
  (4) X3 = s2L ‖ s0H。
}</pre>
            <p>（注：BR 定义按课件原页照录，与标准 ZUC 定义不同。）</p>
            <p><strong>非线性函数（F）</strong></p>
            <p>F 包含 2 个 32 比特记忆单元变量 R<sub>1</sub> 和 R<sub>2</sub>。F 的输入为 3 个 32 比特字 X<sub>0</sub>、X<sub>1</sub>、X<sub>2</sub>，输出为一个 32 比特字 W。计算过程如下：</p>
            <pre class="code">F(X0, X1, X2)
{
  (1) W = (X0 ⊕ R1) ⊞ R2;
  (2) W1 = R1 ⊞ X1;
  (3) W2 = R2 ⊕ X2;
  (4) R1 = S[L1(W1L ‖ W2H)];
  (5) R2 = S[L2(W2L ‖ W1H)]。
}
其中 S 为 32 比特的 S 盒变换，S 盒定义见附录 A；L1 和 L2 为 32 比特线性变换，定义如下：
  L1(X) = X ⊕ (X<<<2) ⊕ (X<<<10) ⊕ (X<<<18) ⊕ (X<<<24)，
  L2(X) = X ⊕ (X<<<8) ⊕ (X<<<14) ⊕ (X<<<22) ⊕ (X<<<30)。</pre>
            <p>参考链接：<a href="https://www.cnblogs.com/arduous-termite/articles/17296541.html">ZUC 非线性函数资料</a></p>
            <p><strong>注意</strong></p>
            <ul>
              <li><strong>ZUC-128</strong>：初始密钥128bit，初始向量128bit；密钥32bit；明文长度32bit；异或。</li>
              <li><strong>ZUC-256</strong>：初始密钥256bit，初始向量184bit；密钥32bit；明文长度32bit；异或。</li>
            </ul>`,
        },
      ],
    },
  ],
};

export default ch2;

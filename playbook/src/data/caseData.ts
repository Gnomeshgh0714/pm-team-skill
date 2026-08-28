// 真实战例数据：学术论文审稿协作平台 · 第一轮迭代（2026-07-16，单日完成）
// 来源：/Volumes/roy/hermes工作台/01-代码项目/pm-team/ 真实产出文件提炼

export interface StageInfo {
  id: number
  name: string
  role: string
  roleType: 'sub' | 'main'
  deliverable: string
  summary: string
  stats: string[]
}

export interface DecisionPoint {
  id: string
  stageId: number
  level: '严重' | '中等'
  title: string
  detail: string
  question: string
  options: string[]
  actualChoice: number        // 真实总监选了哪个（index）
  actualReason: string        // 真实裁决理由
}

export const heroStats = [
  { label: '单日完成全流程', value: '6 阶段' },
  { label: '正式文件', value: '14 份 / ~7000 行' },
  { label: '评审挖出严重问题', value: '5 项' },
  { label: '决策留痕', value: '10 条' },
]

export const stages: StageInfo[] = [
  {
    id: 1, name: '用研输入', role: '用户研究专员', roleType: 'sub',
    deliverable: '用研报告（272 行）',
    summary: '目标用户为学术期刊编辑与审稿人。核心痛点：审稿周期长、任务分配效率低、新人审稿无从下手。竞品分析覆盖 ScholarOne、Editorial Manager、OpenReview 等 4 个系统，痛点均带具体场景，需求按评分模型排序 P0/P1/P2。',
    stats: ['竞品 ≥ 3 个', '痛点有场景', '优先级有评分模型'],
  },
  {
    id: 2, name: '产品设计', role: '产品设计专员', roleType: 'sub',
    deliverable: 'PRD V1.0（1793 行）',
    summary: '覆盖任务创建→审稿分配→双盲审稿→意见汇总→终审建议全流程，含状态机定义、数据模型、验收标准。提交前完成 5 项自检。',
    stats: ['状态机 6 状态', '数据模型 8 实体', '验收标准 AC 全覆盖'],
  },
  {
    id: 3, name: '评审攻防', role: '产品评审专员', roleType: 'sub',
    deliverable: '评审意见（572 行，12 条问题）',
    summary: '评审专员只提问题不给方案，挖出 5 项严重问题：状态机死锁、跨模板对齐根本性错误、双盲匿名化不足、并发竞态、User 实体缺失。结论：需重大修改。',
    stats: ['5 项严重', '7 项中等', '结论：需重大修改'],
  },
  {
    id: 4, name: '总监终审', role: '产品总监', roleType: 'main',
    deliverable: '终审决策（7 项必须改 + 7 项建议改）',
    summary: '产品总监对 12 条问题逐项裁决，结论「有条件通过」。每项裁决写明理由，全部写入决策日志。下面轮到你来裁决。',
    stats: ['逐项裁决', '理由公开', '决策留痕'],
  },
  {
    id: 5, name: '落地执行', role: '产品设计专员', roleType: 'sub',
    deliverable: 'PRD V1.1（2175 行，92 处修改标注）+ 复审意见（552 行）',
    summary: '14 项修改全部落实（必须 7/7 + 建议 7/7），复审逐项验证通过，仅引入 2 个轻微问题不影响阻断性。PRD V1.1 进入技术设计阶段。',
    stats: ['修改落实 14/14', '复审结论：通过'],
  },
  {
    id: 6, name: '复盘优化', role: '产品总监', roleType: 'main',
    deliverable: '复盘报告 + 3 个可沉淀技能',
    summary: 'L1（走完流程）+ L2（发现问题）验收通过。沉淀 3 个可复用技能，8 条决策入日志，能力路径 L1→L2→L3→L4。',
    stats: ['L1+L2 通过', '沉淀技能 ×3', '决策日志 8 条'],
  },
]

// 阶段 4 交互：5 个严重问题，用户扮演总监裁决
export const decisions: DecisionPoint[] = [
  {
    id: 'C-01', stageId: 4, level: '严重',
    title: '状态机死锁：REVIEWING 状态全部审稿人超时后无合法回退路径',
    detail: 'PRD 状态机中，REVIEWING 状态下若所有审稿人超时未提交，没有任何合法的状态出口——任务将永久卡死。',
    question: '作为总监，你的裁决？',
    options: [
      '采纳评审意见：补全 REVIEWING→PENDING 回退路径，必须修改',
      '不采纳：P0 阶段超时概率低，记录为已知风险即可',
      '折中：加超时提醒，但不改状态机',
    ],
    actualChoice: 0,
    actualReason: '回退路径缺失是阻断性逻辑漏洞，必须补全。技术设计阶段无法绕过。',
  },
  {
    id: 'C-02', stageId: 4, level: '严重',
    title: '跨模板维度对齐逻辑根本性错误：以 dimensionId 跨模板对齐将导致数据错乱',
    detail: '不同审稿模板的 dimensionId 各自独立编号，跨模板按 id 对齐会把「创新性」对齐成「方法论」，汇总数据直接错乱。',
    question: '作为总监，你的裁决？',
    options: [
      '强制同一任务统一模板，从根源消除问题，删除跨模板对齐逻辑',
      '保留跨模板对齐，改为按维度名称模糊匹配',
      '推迟到 P1 处理，P0 先上线再说',
    ],
    actualChoice: 0,
    actualReason: '跨模板对齐在 P0 无实际需求场景，强制统一模板从根源消除问题，实现成本最低。',
  },
  {
    id: 'C-03', stageId: 4, level: '严重',
    title: '双盲匿名化不足：关键词过滤无法覆盖学术文本中的身份线索',
    detail: 'PRD 用关键词过滤实现双盲匿名，但学者身份线索藏在引用模式、研究对象、数据来源里，关键词过滤必然泄露。',
    question: '作为总监，你的裁决？',
    options: [
      '采纳两阶段方案：系统自动匿名化 + 人工审核兜底',
      '维持关键词过滤，加强词库即可',
      '去掉双盲，改单盲降低复杂度',
    ],
    actualChoice: 0,
    actualReason: '双盲安全是学术审稿的核心合规要求，关键词过滤确实不足。两阶段方案解决「不可逆 vs 退回修改」矛盾。',
  },
  {
    id: 'C-04', stageId: 4, level: '严重',
    title: '并发竞态：多审稿人同时提交时「全部已提交」状态判定可能卡死',
    detail: '评审专员提出两个方案：A) 数据库事务+行锁；B) 消息队列串行化。',
    question: '作为总监，你的裁决？',
    options: [
      '方案 A：数据库事务+行锁，P0 数据量小，最简单可靠',
      '方案 B：消息队列，扩展性更好',
      '两个都要，做可切换方案',
    ],
    actualChoice: 0,
    actualReason: 'P0 阶段数据量不大，事务+行锁最简单可靠，无需引入消息队列等额外组件。',
  },
  {
    id: 'C-07', stageId: 4, level: '严重',
    title: '边界蔓延：退稿重审属 P1 功能，但 P0 中已部分实现',
    detail: '退稿重审涉及多轮审稿，数据模型需大幅扩展。评审建议移至 P1，仅预留 round 字段。',
    question: '作为总监，你的裁决？',
    options: [
      '采纳：退稿重审移至 P1，P0 聚焦核心流程验证',
      '不采纳：退稿重审是高频场景，P0 必须做',
      '折中：做简化版退稿重审（只支持一轮）',
    ],
    actualChoice: 0,
    actualReason: 'P0 应聚焦核心流程验证。仅在数据模型预留 round 字段，状态机标注「P1 预留」。',
  },
]

export const outcome = {
  title: '真实战例战果',
  rows: [
    ['迭代周期', '单日 6 阶段闭环（2026-07-16）'],
    ['PRD 规模', 'V1.0 1793 行 → V1.1 2175 行（92 处修改标注）'],
    ['评审产出', '评审意见 572 行 + 复审意见 552 行'],
    ['修改落实', '必须 7/7 + 建议 7/7，复审通过'],
    ['沉淀技能', '3 个可复用技能'],
    ['能力验收', 'L1（走完流程）+ L2（发现问题）双通过'],
  ],
  levels: [
    ['L1', '走完流程——输出规范、逻辑自洽'],
    ['L2', '发现问题——评审攻防挖出真实漏洞'],
    ['L3', '沉淀技能——经验转化为可复用资产'],
    ['L4', '适应新方向——流程迁移到新产品领域'],
  ],
}

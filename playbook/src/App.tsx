import { useState } from 'react'
import { stages, decisions, heroStats, outcome } from './data/caseData'

type View = 'hero' | 'play' | 'score'

export default function App() {
  const [view, setView] = useState<View>('hero')
  const [stageIdx, setStageIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [reveal, setReveal] = useState<Record<string, boolean>>({})

  const stage = stages[stageIdx]
  const stageDecisions = decisions.filter(d => d.stageId === stage?.id)
  const answeredAll = stageDecisions.every(d => answers[d.id] !== undefined)
  const matches = decisions.filter(d => answers[d.id] === d.actualChoice).length

  const choose = (id: string, i: number) => {
    setAnswers(p => ({ ...p, [id]: i }))
    setReveal(p => ({ ...p, [id]: true }))
  }

  return (
    <div className="min-h-screen">
      {view === 'hero' && (
        <header className="max-w-4xl mx-auto px-6 pt-24 pb-16">
          <p className="text-xs font-mono text-indigo-400 mb-4 tracking-widest">MULTI-AGENT PM TEAM · INTERACTIVE PLAYBOOK</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 leading-tight">
            你来当产品总监：<br />6 个阶段，5 次裁决，<span className="text-indigo-400">一个真实战场</span>
          </h1>
          <p className="mt-5 text-zinc-400 max-w-2xl leading-relaxed">
            这是一个多 Agent 产品经理团队协作流程的可交互体验。素材来自真实战例——单日完成
            「用研 → PRD → 评审攻防 → 总监终审 → 修改复审 → 复盘」全流程。
            你将扮演产品总监，对评审专员挖出的 5 项严重问题逐项裁决，
            最后看看你的判断和真实总监有多一致。
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroStats.map(s => (
              <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-xs text-zinc-500">{s.label}</p>
                <p className="mt-1 font-semibold text-indigo-400">{s.value}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setView('play')}
            className="mt-10 px-8 py-3.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition text-lg">
            开始扮演产品总监 →
          </button>
          <p className="mt-4 text-xs text-zinc-600">约 5 分钟 · 无需注册 · 决策在本地进行</p>
        </header>
      )}

      {view === 'play' && (
        <main className="max-w-4xl mx-auto px-6 py-10">
          {/* 流水线进度 */}
          <div className="flex items-center gap-1.5 mb-10 overflow-x-auto pb-2">
            {stages.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => i <= stageIdx && setStageIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${
                    i === stageIdx ? 'bg-indigo-500 text-white'
                    : i < stageIdx ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-500'}`}>
                  {i < stageIdx ? '✓ ' : ''}{s.name}
                </button>
                {i < stages.length - 1 && <span className="text-zinc-700">→</span>}
              </div>
            ))}
          </div>

          {/* 阶段卡片 */}
          <div className="anim rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8" key={stage.id}>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-zinc-500">阶段 {stage.id}/6</span>
              <span className={`text-xs px-2 py-0.5 rounded ${stage.roleType === 'main' ? 'bg-amber-500/15 text-amber-400' : 'bg-sky-500/15 text-sky-400'}`}>
                {stage.role}（{stage.roleType === 'main' ? '主 Agent' : '子 Agent'}）
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-zinc-50">{stage.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">交付物：{stage.deliverable}</p>
            <p className="mt-4 text-zinc-300 leading-relaxed">{stage.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stage.stats.map(s => (
                <span key={s} className="px-3 py-1 rounded-full bg-zinc-800 text-xs text-zinc-400">{s}</span>
              ))}
            </div>
          </div>

          {/* 决策点（仅阶段4） */}
          {stageDecisions.length > 0 && (
            <div className="mt-6 space-y-5">
              <p className="text-sm text-amber-400">⚡ 以下 5 项严重问题等待你裁决——选择后揭示真实总监的决策</p>
              {stageDecisions.map((d, di) => (
                <div key={d.id} className="anim rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" style={{ animationDelay: `${di * 60}ms` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">{d.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/15 text-rose-400">{d.level}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-zinc-100 leading-snug">{d.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{d.detail}</p>
                  <p className="mt-4 text-sm font-medium text-zinc-200">{d.question}</p>
                  <div className="mt-3 space-y-2">
                    {d.options.map((opt, i) => {
                      const chosen = answers[d.id] === i
                      const isActual = reveal[d.id] && i === d.actualChoice
                      const isWrong = chosen && i !== d.actualChoice
                      return (
                        <button key={i} onClick={() => choose(d.id, i)} disabled={reveal[d.id]}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                            isActual ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                            : isWrong ? 'border-rose-500/60 bg-rose-500/10 text-rose-300'
                            : chosen ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-600 text-zinc-300'}`}>
                          {isActual && '✓ '}{isWrong && '✗ '}{opt}
                        </button>
                      )
                    })}
                  </div>
                  {reveal[d.id] && (
                    <div className="anim mt-4 rounded-xl bg-zinc-800/60 p-4">
                      <p className="text-xs text-zinc-500">真实总监裁决理由</p>
                      <p className="mt-1 text-sm text-zinc-300">{d.actualReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 导航 */}
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStageIdx(i => Math.max(0, i - 1))} disabled={stageIdx === 0}
              className="px-5 py-2.5 rounded-lg border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition">
              ← 上一阶段
            </button>
            {stageIdx < stages.length - 1 ? (
              <button onClick={() => setStageIdx(i => i + 1)} disabled={!answeredAll}
                className="px-5 py-2.5 rounded-lg bg-indigo-500 text-sm text-white hover:bg-indigo-400 disabled:opacity-30 transition">
                下一阶段 →
              </button>
            ) : (
              <button onClick={() => setView('score')}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 text-sm text-white hover:bg-emerald-400 transition">
                查看我的裁决得分 →
              </button>
            )}
          </div>
          {!answeredAll && stageDecisions.length > 0 && (
            <p className="mt-3 text-xs text-zinc-600 text-right">完成全部 5 项裁决后继续</p>
          )}
        </main>
      )}

      {view === 'score' && (
        <main className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-xs font-mono text-indigo-400 tracking-widest">DEBRIEF</p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-50">
            你与真实总监的决策一致率：{matches}/{decisions.length}
          </h2>
          <p className="mt-3 text-zinc-400">
            {matches === 5 ? '完美一致——你具备总监级判断力。' :
             matches >= 3 ? '多数一致——分歧项往往正是最值得复盘的决策点。' :
             '分歧较多——点开每个决策看看真实总监的推理，这正是这个流程的价值：让判断显性化。'}
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="font-semibold text-zinc-100">{outcome.title}</h3>
              <div className="mt-4 space-y-2.5">
                {outcome.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 text-sm">
                    <span className="text-zinc-500 shrink-0">{k}</span>
                    <span className="text-zinc-200 text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="font-semibold text-zinc-100">能力升级路径</h3>
              <div className="mt-4 space-y-3">
                {outcome.levels.map(([l, d], i) => (
                  <div key={l} className="flex gap-3 items-start">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono shrink-0 ${i < 2 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>{l}</span>
                    <p className="text-sm text-zinc-400">{d}{i < 2 && <span className="text-emerald-400"> ✓ 本战例已达成</span>}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
            <h3 className="font-semibold text-zinc-100">把这套流程装进口袋</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              你刚才体验的 6 阶段工作流已封装为 Claude Code / Hermes 可用的 Skill：
              5 个角色、评审攻防机制、决策留痕、能力升级路径，支持完整模式与快速模式。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://github.com/Gnomeshgh0714/pm-team-skill" target="_blank"
                className="px-5 py-2.5 rounded-lg bg-indigo-500 text-sm text-white hover:bg-indigo-400 transition">
                GitHub 仓库 →
              </a>
              <button onClick={() => { setView('hero'); setStageIdx(0); setAnswers({}); setReveal({}) }}
                className="px-5 py-2.5 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500 transition">
                再玩一轮
              </button>
            </div>
          </div>
        </main>
      )}

      <footer className="border-t border-zinc-800 mt-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center text-xs text-zinc-600">
          <span>© 2026 Gnomeshgh0714 · PM Team Skill Interactive Playbook</span>
          <a className="text-indigo-400 hover:underline" href="https://github.com/Gnomeshgh0714/pm-team-skill">GitHub</a>
        </div>
      </footer>
    </div>
  )
}

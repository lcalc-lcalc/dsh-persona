/**
 * Host half of the persona bundle.
 *
 * The bundle keeps one persona list plus a Chinese chain-of-thought directive in
 * its own live (volatile) configuration, so the "人设" page can edit them
 * through the Settings service and this half reads the latest values on every
 * prompt assembly.
 *
 * Agent presets already own the `deployment:persona-prefix` section for their
 * scope (the shipped `@deepseek-ai/dsh-persona` row registers it per Agent), so
 * this plugin does not register a competing section — it rewrites that one
 * section of the assembled prompt in the `system-prompt/assemble` waterfall.
 * The rewrite is scoped to root conversations: subagent sessions keep their own
 * delegated persona. Because the replacement text is read on every assembly, a
 * change made in the page reaches the next model step of every conversation,
 * old or new.
 *
 * @module dsh-persona
 */
import { SEED_PERSONA } from './seed.js'

/**
 * Schemastery provides the live (`volatile`) Config fields the Settings service
 * edits in place. A packaged install resolves it from the profile; a linked
 * checkout may not see the installation's packages, so the vendored copy is a
 * fallback. Both copies implement the same `Symbol.for`-based volatile
 * protocol, which the installed copy recognises.
 */
let z
try {
  z = (await import('@deepseek-ai/schemastery')).default
} catch {
  z = (await import('./vendor/schemastery/lib/index.mjs')).default
}

/** Section name shared with the shipped deployment / preset persona prefix. */
const PERSONA_SECTION = 'deployment:persona-prefix'

/** Default instruction that steers the thinking channel to Simplified Chinese. */
const DEFAULT_COT_PROMPT = [
  '思考规范：所有内部推理（thinking）必须使用简体中文。',
  '先复述并拆解用户真正想要的结果，再列出约束与已知条件，接着比较可选做法、检查边界情况，最后才给出结论。',
  '不要用英文思考，也不要省略推理过程；最终回答同样使用简体中文。',
].join('\n')

export const Config = z.object({
  personas: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        prompt: z.string(),
      }),
    )
    .default([{ id: 'seed', name: '小澜', prompt: SEED_PERSONA }])
    .volatile(),
  activeId: z.string().default('seed').volatile(),
  chineseCot: z.boolean().default(true).volatile(),
  cotPrompt: z.string().default(DEFAULT_COT_PROMPT).volatile(),
})

/**
 * Mount the persona rewrite for every root conversation.
 * @param ctx - Host context of this plugin row.
 * @param config - Parsed configuration whose volatile fields are live references.
 */
export function apply(ctx, config) {
  const sectionText = () => {
    const parts = []
    const personas = config.personas.get() ?? []
    const activeId = config.activeId.get()
    const active = personas.find((persona) => persona.id === activeId)
    const prompt = typeof active?.prompt === 'string' ? active.prompt.trim() : ''
    if (prompt.length > 0) parts.push(prompt)
    if (config.chineseCot.get()) {
      const cot = (config.cotPrompt.get() ?? '').trim()
      if (cot.length > 0) parts.push(cot)
    }
    return parts.join('\n\n')
  }

  ctx.on('system-prompt/assemble', async (assembly, context, next) => {
    const assembled = await next()
    if (isChildSession(context?.agent)) return assembled
    const text = sectionText()
    let replaced = false
    const sections = []
    for (const section of assembled.sections) {
      if (section.name !== PERSONA_SECTION) {
        sections.push(section)
        continue
      }
      replaced = true
      if (text.length > 0) sections.push({ ...section, text })
    }
    if (!replaced && text.length > 0) sections.unshift({ name: PERSONA_SECTION, text })
    return { ...assembled, sections }
  })
}

/** Whether the assembly belongs to a delegated child conversation. */
function isChildSession(agent) {
  const header = agent?.session?.header
  if (header === undefined || header === null) return false
  return Boolean(header.parentSessionId ?? header.parentSession)
}

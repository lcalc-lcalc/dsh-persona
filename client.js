window.__ModuleLoader__.load({
  id: 'dsh-persona',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useRef, useCallback } = React

    const NS = 'dsh-persona'
    const PANEL_ID = 'persona'
    const ENTRY_ID = 'persona'
    const FIELDS = ['personas', 'activeId', 'chineseCot', 'cotPrompt']

    const zh = {
      panel: '人设',
      eyebrow: 'SYSTEM PROMPT',
      title: '人设',
      subtitle: '挑选一套人设作为 AI 的系统提示词，并决定它是否用中文思考。设定会立即作用于已有对话，并默认带入每一个新对话。',
      current: '当前人设',
      personas: '人设列表',
      create: '新建',
      untitled: '未命名人设',
      emptyPrompt: '还没有填写提示词',
      emptyList: '还没有人设，先新建一个吧。',
      defaultBadge: '默认',
      makeDefault: '设为默认人设',
      editor: '编辑',
      nameLabel: '名称',
      namePlaceholder: '例如：小澜',
      promptLabel: '提示词',
      promptPlaceholder: '写下这个 AI 的身份、性格、说话方式、可用能力与禁区……',
      promptHint: '这段文字会作为系统提示词出现在每次请求的最前面。',
      cotTitle: '中文思维链',
      cotDesc: '要求模型在内部推理时使用简体中文，先拆解问题再作答。',
      cotLabel: '思维链要求',
      advanced: '高级：自定义思维链要求',
      save: '保存',
      saving: '保存中…',
      saved: '已保存',
      savedAlt1: '记下啦～',
      savedAlt2: '人设已就位 ✨',
      credit: '彻柑可可制作 · Made by Chegan Coco',
      defaultSaved: '已设为默认人设',
      conflict: '配置已在别处更新，已重新载入。',
      saveFailed: '保存失败',
      retry: '重试',
      delete: '删除',
      confirmDelete: '确认删除',
      unsaved: '有未保存的修改',
      missingTitle: '人设插件尚未激活',
      missingDesc: 'Host 侧找不到可编辑的配置。请确认插件已安装并在「插件」页启用，然后重试。',
      errorTitle: '读取配置失败',
      loading: '正在读取配置…',
      activeNow: '已生效',
      newName: '新的人设',
      hintSave: 'Ctrl/⌘ + S 保存',
    }

    const en = {
      panel: 'Persona',
      eyebrow: 'SYSTEM PROMPT',
      title: 'Persona',
      subtitle: 'Choose the system prompt that defines the AI, and decide whether it thinks in Chinese. The setting applies to existing conversations and carries into every new one.',
      current: 'Active persona',
      personas: 'Personas',
      create: 'New',
      untitled: 'Untitled persona',
      emptyPrompt: 'No prompt yet',
      emptyList: 'No personas yet. Create one to begin.',
      defaultBadge: 'Default',
      makeDefault: 'Make default',
      editor: 'Edit',
      nameLabel: 'Name',
      namePlaceholder: 'e.g. Nova',
      promptLabel: 'Prompt',
      promptPlaceholder: 'Describe the identity, personality, voice, abilities, and limits…',
      promptHint: 'This text leads the system prompt of every request.',
      cotTitle: 'Chinese chain-of-thought',
      cotDesc: 'Ask the model to reason in Simplified Chinese, breaking the problem down before answering.',
      cotLabel: 'Thinking directive',
      advanced: 'Advanced: custom thinking directive',
      save: 'Save',
      saving: 'Saving…',
      saved: 'Saved',
      savedAlt1: 'Noted~',
      savedAlt2: 'Persona locked in ✨',
      credit: 'Made by Chegan Coco',
      defaultSaved: 'Default persona updated',
      conflict: 'The configuration changed elsewhere; reloaded.',
      saveFailed: 'Save failed',
      retry: 'Retry',
      delete: 'Delete',
      confirmDelete: 'Confirm delete',
      unsaved: 'Unsaved changes',
      missingTitle: 'Persona plugin is not active yet',
      missingDesc: 'The Host exposes no editable configuration for this page. Check that the plugin is installed and enabled, then retry.',
      errorTitle: 'Could not read the configuration',
      loading: 'Loading configuration…',
      activeNow: 'Active',
      newName: 'New persona',
      hintSave: 'Ctrl/⌘ + S to save',
    }

    const CSS = [
      '.dshp-root{width:100%;min-height:100%;box-sizing:border-box;overflow-y:auto;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-primary,#111);font-family:var(--dsw-font-family,inherit);animation:dshp-fade .22s ease both}',
      '.dshp-inner{max-width:1060px;margin:0 auto;padding:40px 40px 72px;box-sizing:border-box}',
      '.dshp-header{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:26px;animation:dshp-rise .36s cubic-bezier(.22,.61,.36,1) both}',
      '.dshp-eyebrow{font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary,#9ca3af);margin-bottom:10px}',
      '.dshp-title{margin:0;font-size:26px;line-height:1.25;font-weight:600;letter-spacing:-.01em}',
      '.dshp-subtitle{margin:8px 0 0;max-width:560px;font-size:13px;line-height:1.75;color:var(--dsw-alias-label-secondary,#4b5563)}',
      '.dshp-status{display:inline-flex;align-items:center;gap:8px;flex:none;max-width:260px;padding:8px 14px;border-radius:999px;background:var(--dsw-alias-bg-layer-2,#f5f6f8);border:1px solid var(--dsw-alias-border-l4,rgba(15,23,42,.08));font-size:12px;color:var(--dsw-alias-label-secondary,#4b5563);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.dshp-status b{font-weight:600;color:var(--dsw-alias-label-primary,#111);overflow:hidden;text-overflow:ellipsis}',
      '.dshp-status-dot{width:7px;height:7px;flex:none;border-radius:50%;background:var(--dsw-alias-state-business-primary,#4176e6);box-shadow:0 0 0 3px rgba(65,118,230,.18)}',
      '.dshp-grid{display:grid;grid-template-columns:318px minmax(0,1fr);gap:24px;align-items:start;animation:dshp-rise .42s cubic-bezier(.22,.61,.36,1) both;animation-delay:.04s}',
      '@media (max-width:880px){.dshp-grid{grid-template-columns:1fr}.dshp-inner{padding:28px 20px 56px}.dshp-header{flex-direction:column;gap:14px}}',
      '.dshp-list-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:0 2px}',
      '.dshp-list-title{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary,#9ca3af)}',
      '.dshp-cards{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}',
      '.dshp-card{position:relative;display:flex;align-items:stretch;border-radius:14px;border:1px solid transparent;background:var(--dsw-alias-bg-layer-2,#f5f6f8);transition:transform .18s ease,border-color .18s ease,background .18s ease,box-shadow .18s ease;animation:dshp-fade .32s ease both}',
      '.dshp-card:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(15,23,42,.07)}',
      '.dshp-card.is-selected{border-color:var(--dsw-alias-brand-primary,#4d6bfe);background:var(--dsw-alias-bg-base,#fff);box-shadow:0 6px 18px rgba(77,107,254,.13)}',
      '.dshp-card-main{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:14px 16px;border:0;border-radius:14px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.dshp-card-main:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4d6bfe);outline-offset:2px}',
      '.dshp-card-name{display:flex;align-items:center;gap:8px;max-width:100%;font-size:13.5px;font-weight:600;line-height:1.4}',
      '.dshp-card-name span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dshp-badge{flex:none;padding:2px 8px;border-radius:999px;background:rgba(77,107,254,.12);color:var(--dsw-alias-brand-primary,#4d6bfe);font-size:10px;font-weight:600;letter-spacing:.02em}',
      '.dshp-card-preview{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;line-height:1.65;color:var(--dsw-alias-label-tertiary,#9ca3af);word-break:break-word}',
      '.dshp-star{align-self:center;margin-right:8px;width:28px;height:28px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-tertiary,#9ca3af);cursor:pointer;opacity:0;transition:opacity .16s ease,background .16s ease,color .16s ease}',
      '.dshp-card:hover .dshp-star,.dshp-star:focus-visible{opacity:1}',
      '.dshp-star:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(15,23,42,.06));color:var(--dsw-alias-brand-primary,#4d6bfe)}',
      '.dshp-editor{border:1px solid var(--dsw-alias-border-l4,rgba(15,23,42,.08));border-radius:18px;background:var(--dsw-alias-bg-base,#fff);box-shadow:0 1px 2px rgba(15,23,42,.04);padding:24px;animation:dshp-rise .3s cubic-bezier(.22,.61,.36,1) both}',
      '.dshp-editor-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}',
      '.dshp-editor-title{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--dsw-alias-label-secondary,#4b5563)}',
      '.dshp-field{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}',
      '.dshp-label{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary,#4b5563)}',
      '.dshp-hint{font-size:11.5px;line-height:1.6;color:var(--dsw-alias-label-tertiary,#9ca3af)}',
      '.dshp-input,.dshp-textarea{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l4,rgba(15,23,42,.1));border-radius:10px;background:var(--dsw-alias-bg-layer-2,#f7f8fa);color:inherit;font:inherit;font-size:13px;padding:10px 12px;outline:none;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}',
      '.dshp-input:focus,.dshp-textarea:focus{border-color:var(--dsw-alias-brand-primary,#4d6bfe);background:var(--dsw-alias-bg-base,#fff);box-shadow:0 0 0 3px rgba(77,107,254,.13)}',
      '.dshp-textarea{min-height:264px;line-height:1.8;resize:vertical}',
      '.dshp-cot{display:flex;align-items:flex-start;gap:14px;padding:14px 16px;border-radius:14px;border:1px solid var(--dsw-alias-border-l4,rgba(15,23,42,.08));background:var(--dsw-alias-bg-layer-2,#f7f8fa);transition:border-color .2s ease,background .2s ease}',
      '.dshp-cot.is-on{border-color:rgba(77,107,254,.38);background:rgba(77,107,254,.055)}',
      '.dshp-cot-text{display:flex;flex-direction:column;gap:4px;min-width:0}',
      '.dshp-cot-title{font-size:12.5px;font-weight:600}',
      '.dshp-cot-desc{font-size:11.5px;line-height:1.62;color:var(--dsw-alias-label-tertiary,#9ca3af)}',
      '.dshp-switch{margin-left:auto;flex:none;width:40px;height:22px;padding:2px;border:0;border-radius:999px;background:var(--dsw-alias-border-l4,#d8dbe2);cursor:pointer;transition:background .22s cubic-bezier(.22,.61,.36,1)}',
      '.dshp-switch.is-on{background:var(--dsw-alias-state-business-primary,#4176e6)}',
      '.dshp-switch:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4d6bfe);outline-offset:2px}',
      '.dshp-switch-knob{display:block;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(15,23,42,.22);transform:translateX(0);transition:transform .24s cubic-bezier(.22,.61,.36,1)}',
      '.dshp-switch.is-on .dshp-switch-knob{transform:translateX(20px)}',
      '.dshp-advanced{margin-top:14px}',
      '.dshp-advanced summary{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary,#4b5563);cursor:pointer;list-style:none;display:inline-flex;align-items:center;gap:6px;padding:4px 0}',
      '.dshp-advanced summary::-webkit-details-marker{display:none}',
      '.dshp-advanced summary::before{content:"";width:0;height:0;border-left:5px solid currentColor;border-top:4px solid transparent;border-bottom:4px solid transparent;transition:transform .18s ease;transform:rotate(0)}',
      '.dshp-advanced[open] summary::before{transform:rotate(90deg)}',
      '.dshp-advanced-body{padding-top:10px;animation:dshp-fade .22s ease both}',
      '.dshp-footer{display:flex;align-items:center;gap:10px;margin-top:22px;padding-top:18px;border-top:1px solid var(--dsw-alias-border-l4,rgba(15,23,42,.08))}',
      '.dshp-footer-spacer{flex:1}',
      '.dshp-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:34px;padding:0 15px;border-radius:9px;border:1px solid transparent;background:transparent;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .16s ease,border-color .16s ease,color .16s ease,transform .16s ease,box-shadow .16s ease}',
      '.dshp-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4d6bfe);outline-offset:2px}',
      '.dshp-btn:disabled{opacity:.5;cursor:default}',
      '.dshp-btn-primary{background:var(--dsw-alias-button-primary-fill,#111);color:var(--dsw-alias-label-primary-foreground,#fff);box-shadow:0 1px 2px rgba(15,23,42,.16)}',
      '.dshp-btn-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,#333);box-shadow:0 4px 12px rgba(15,23,42,.18)}',
      '.dshp-btn-primary:active:not(:disabled){transform:scale(.98)}',
      '.dshp-btn-ghost{border-color:var(--dsw-alias-border-l4,rgba(15,23,42,.12));background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-secondary,#4b5563)}',
      '.dshp-btn-ghost:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(15,23,42,.05))}',
      '.dshp-btn-ghost.is-active{border-color:rgba(77,107,254,.45);color:var(--dsw-alias-brand-primary,#4d6bfe);background:rgba(77,107,254,.07)}',
      '.dshp-btn-danger{color:var(--dsw-alias-state-error-primary,#dc2626)}',
      '.dshp-btn-danger:hover:not(:disabled){background:rgba(220,38,38,.08)}',
      '.dshp-dirty{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--dsw-alias-label-tertiary,#9ca3af)}',
      '.dshp-dirty::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-warning-primary,#f59e0b)}',
      '.dshp-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:56px 24px;text-align:center;border:1px dashed var(--dsw-alias-border-l4,rgba(15,23,42,.16));border-radius:18px;color:var(--dsw-alias-label-tertiary,#9ca3af);font-size:12.5px;line-height:1.7}',
      '.dshp-empty-glyph{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-layer-2,#f5f6f8);color:var(--dsw-alias-label-tertiary,#9ca3af)}',
      '.dshp-notice{display:flex;flex-direction:column;gap:12px;padding:28px;border:1px solid var(--dsw-alias-border-l4,rgba(15,23,42,.1));border-radius:18px;background:var(--dsw-alias-bg-layer-2,#f7f8fa);max-width:640px;margin:60px auto;animation:dshp-rise .3s ease both}',
      '.dshp-notice h2{margin:0;font-size:15px;font-weight:600}',
      '.dshp-notice p{margin:0;font-size:12.5px;line-height:1.75;color:var(--dsw-alias-label-secondary,#4b5563)}',
      '.dshp-notice-error{border-color:rgba(220,38,38,.35);background:rgba(220,38,38,.05)}',
      '.dshp-loading{display:flex;align-items:center;justify-content:center;gap:10px;padding:100px 0;font-size:12.5px;color:var(--dsw-alias-label-tertiary,#9ca3af)}',
      '.dshp-spinner{width:15px;height:15px;border-radius:50%;border:2px solid var(--dsw-alias-border-l4,rgba(15,23,42,.14));border-top-color:var(--dsw-alias-brand-primary,#4d6bfe);animation:dshp-spin .8s linear infinite}',
      '.dshp-credit{margin-top:30px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:11px;letter-spacing:.06em;color:var(--dsw-alias-label-tertiary,#9ca3af);opacity:.6;transition:opacity .22s ease;animation:dshp-fade .5s ease both;animation-delay:.14s}',
      '.dshp-credit:hover{opacity:.95}',
      '.dshp-credit-heart{display:inline-flex;color:#f472b6;transition:transform .28s cubic-bezier(.34,1.56,.64,1)}',
      '.dshp-credit:hover .dshp-credit-heart{transform:scale(1.28) rotate(-6deg)}',
      '.dshp-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%);z-index:80;display:inline-flex;align-items:center;gap:8px;max-width:min(440px,80vw);padding:10px 16px;border-radius:999px;background:var(--dsw-alias-bg-overlay,#111827);color:#fff;font-size:12.5px;line-height:1.5;box-shadow:0 10px 30px rgba(15,23,42,.22);animation:dshp-toast-in .26s cubic-bezier(.22,.61,.36,1) both}',
      '.dshp-toast.is-warn{background:#b45309}',
      '.dshp-toast.is-error{background:#b91c1c}',
      '.dshp-save-ok{animation:dshp-pop .28s ease}',
      '@keyframes dshp-fade{from{opacity:0}to{opacity:1}}',
      '@keyframes dshp-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
      '@keyframes dshp-spin{to{transform:rotate(360deg)}}',
      '@keyframes dshp-pop{0%{transform:scale(1)}45%{transform:scale(.97)}100%{transform:scale(1)}}',
      '@keyframes dshp-toast-in{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}',
      '@media (prefers-reduced-motion:reduce){.dshp-root,.dshp-header,.dshp-grid,.dshp-editor,.dshp-card,.dshp-toast,.dshp-advanced-body{animation:none!important}.dshp-card,.dshp-switch,.dshp-switch-knob,.dshp-btn{transition:none!important}}',
    ].join('\n')

    function mountStyle() {
      if (typeof document === 'undefined') return () => {}
      const tagId = 'dsh-persona/styles.css'
      let tag = document.querySelector('style[data-plugin-css="' + tagId + '"]')
      if (tag === null) {
        tag = document.createElement('style')
        tag.dataset.plugin = 'dsh-persona'
        tag.dataset.pluginCss = tagId
        tag.textContent = CSS
        document.head.appendChild(tag)
      }
      return () => {
        if (tag && tag.parentNode === document.head && document.querySelectorAll('style[data-plugin-css="' + tagId + '"]').length <= 1) {
          tag.remove()
        }
      }
    }

    const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

    function normalize(value) {
      const list = Array.isArray(value && value.personas) ? value.personas : []
      return {
        personas: list.map((persona) => ({
          id: String(persona && persona.id ? persona.id : uid()),
          name: String(persona && persona.name ? persona.name : ''),
          prompt: String(persona && persona.prompt ? persona.prompt : ''),
        })),
        activeId: String(value && value.activeId ? value.activeId : ''),
        chineseCot: !(value && value.chineseCot === false),
        cotPrompt: String(value && value.cotPrompt ? value.cotPrompt : ''),
      }
    }

    function preview(text, emptyLabel) {
      const flat = String(text || '').replace(/\s+/g, ' ').trim()
      return flat.length === 0 ? emptyLabel : flat
    }

    function messageOf(error) {
      if (error instanceof Error) return error.message
      return String(error)
    }

    function Glyph(name, size) {
      const s = size || 14
      const common = {
        width: s,
        height: s,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: false,
      }
      if (name === 'plus') return h('svg', common, h('path', { d: 'M12 5v14M5 12h14' }))
      if (name === 'trash') return h('svg', common, h('path', { d: 'M4 7h16M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7M10.2 11v4.4M13.8 11v4.4' }))
      if (name === 'check') return h('svg', common, h('path', { d: 'm5 12.5 4.2 4.2L19 6.8' }))
      if (name === 'star') return h('svg', Object.assign({}, common, { fill: 'currentColor', stroke: 'none' }), h('path', { d: 'm12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8L12 3.6Z' }))
      if (name === 'alert') return h('svg', common, h('circle', { cx: 12, cy: 12, r: 8.4 }), h('path', { d: 'M12 8v4.6M12 15.9v.1' }))
      if (name === 'heart') return h('svg', Object.assign({}, common, { fill: 'currentColor', stroke: 'none' }), h('path', { d: 'M12 20.3s-7.6-4.6-9.2-9.1C1.7 7.9 3.9 5 7 5c1.9 0 3.5 1 4.4 2.5L12 8.7l.6-1.2C13.5 6 15.1 5 17 5c3.1 0 5.3 2.9 4.2 6.2-1.6 4.5-9.2 9.1-9.2 9.1Z' }))
      return null
    }

    function PersonaIcon(props) {
      const size = props.size || 18
      const active = props.active === true
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': true,
          focusable: false,
          style: { color: active ? 'var(--dsw-alias-brand-primary,#4d6bfe)' : 'currentColor' },
        },
        h('circle', { cx: 12, cy: 8.4, r: 3.6, stroke: 'currentColor', strokeWidth: 1.6 }),
        h('path', { d: 'M4.8 20c.5-3.4 3.4-5.6 7.2-5.6s6.7 2.2 7.2 5.6', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        h('path', { d: 'M16.8 2.6l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6Z', fill: 'currentColor', opacity: .55 }),
      )
    }

    function PersonaPage(props) {
      const api = props.persona
      const t = typeof props.t === 'function' ? props.t : (key) => key

      const [phase, setPhase] = useState('loading')
      const [problem, setProblem] = useState('')
      const [model, setModel] = useState(null)
      const [revision, setRevision] = useState(0)
      const [baseline, setBaseline] = useState('')
      const [selectedId, setSelectedId] = useState('')
      const [busy, setBusy] = useState(false)
      const [toast, setToast] = useState(null)
      const [confirmDelete, setConfirmDelete] = useState(false)
      const [savedPulse, setSavedPulse] = useState(0)

      const load = useCallback(async () => {
        setPhase('loading')
        setProblem('')
        setConfirmDelete(false)
        try {
          const namespace = await api.read()
          if (!namespace) {
            setPhase('missing')
            return
          }
          const next = normalize(namespace.value)
          setModel(next)
          setBaseline(JSON.stringify(next))
          setRevision(typeof namespace.revision === 'number' ? namespace.revision : 0)
          setSelectedId((current) => {
            if (next.personas.some((persona) => persona.id === current)) return current
            const active = next.personas.find((persona) => persona.id === next.activeId)
            return active ? active.id : next.personas.length > 0 ? next.personas[0].id : ''
          })
          setPhase('ready')
        } catch (error) {
          setProblem(messageOf(error))
          setPhase('error')
        }
      }, [api])

      useEffect(() => {
        load()
      }, [load])

      useEffect(() => {
        if (!toast) return undefined
        const timer = window.setTimeout(() => setToast(null), 2800)
        return () => window.clearTimeout(timer)
      }, [toast])

      const showToast = useCallback((kind, text) => setToast({ kind, text, id: Date.now() }), [])

      /** A small easter egg: saving picks one of a few friendly confirmations. */
      const pickSaved = useCallback((translate) => {
        const pool = [translate('saved'), translate('savedAlt1'), translate('savedAlt2')]
        return pool[Math.floor(Math.random() * pool.length)]
      }, [])

      const persist = useCallback(
        async (nextModel, note) => {
          if (!nextModel) return
          setBusy(true)
          setProblem('')
          try {
            const result = await api.write(nextModel, revision)
            if (result.kind === 'ok') {
              const normalized = normalize(result.view && result.view.value ? result.view.value : nextModel)
              setModel(normalized)
              setBaseline(JSON.stringify(normalized))
              setRevision(result.view && typeof result.view.revision === 'number' ? result.view.revision : revision + 1)
              setSavedPulse(Date.now())
              showToast('success', note || pickSaved(t))
              return
            }
            if (result.kind === 'conflict') {
              showToast('warn', t('conflict'))
              await load()
              return
            }
            const message = result.message || t('saveFailed')
            setProblem(message)
            showToast('error', message)
          } catch (error) {
            setProblem(messageOf(error))
            showToast('error', messageOf(error))
          } finally {
            setBusy(false)
          }
        },
        [api, revision, load, showToast, t],
      )

      const saveAll = useCallback(() => {
        if (model) persist(model, null)
      }, [model, persist])

      const saveRef = useRef(saveAll)
      saveRef.current = saveAll
      useEffect(() => {
        const onKey = (event) => {
          if ((event.metaKey || event.ctrlKey) && String(event.key).toLowerCase() === 's') {
            event.preventDefault()
            saveRef.current()
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [])

      const updateModel = (mutate) => {
        setModel((current) => (current ? mutate(current) : current))
      }

      const updatePersona = (id, fields) => {
        updateModel((current) => ({
          ...current,
          personas: current.personas.map((persona) => (persona.id === id ? { ...persona, ...fields } : persona)),
        }))
      }

      const addPersona = () => {
        const persona = { id: uid(), name: t('newName'), prompt: '' }
        updateModel((current) => ({ ...current, personas: [...current.personas, persona] }))
        setSelectedId(persona.id)
        setConfirmDelete(false)
      }

      const deleteSelected = () => {
        if (!model) return
        const target = model.personas.find((persona) => persona.id === selectedId)
        if (!target) return
        if (!confirmDelete) {
          setConfirmDelete(true)
          return
        }
        const personas = model.personas.filter((persona) => persona.id !== target.id)
        const activeId = model.activeId === target.id ? (personas.length > 0 ? personas[0].id : '') : model.activeId
        setModel({ ...model, personas, activeId })
        setSelectedId(personas.length > 0 ? personas[0].id : '')
        setConfirmDelete(false)
      }

      const makeDefault = (id, save) => {
        if (!model) return
        const next = { ...model, activeId: id }
        setModel(next)
        if (save) persist(next, t('defaultSaved'))
      }

      const selected = model ? model.personas.find((persona) => persona.id === selectedId) || null : null
      const activePersona = model ? model.personas.find((persona) => persona.id === model.activeId) || null : null
      const dirty = model !== null && JSON.stringify(model) !== baseline

      if (phase === 'loading') {
        return h('div', { className: 'dshp-root' }, h('div', { className: 'dshp-loading' }, h('span', { className: 'dshp-spinner' }), t('loading')))
      }

      if (phase === 'missing' || phase === 'error') {
        return h(
          'div',
          { className: 'dshp-root' },
          h(
            'div',
            { className: 'dshp-inner' },
            h(
              'div',
              { className: 'dshp-notice' + (phase === 'error' ? ' dshp-notice-error' : '') },
              h('h2', null, phase === 'error' ? t('errorTitle') : t('missingTitle')),
              h('p', null, phase === 'error' ? problem : t('missingDesc')),
              h('div', null, h('button', { type: 'button', className: 'dshp-btn dshp-btn-ghost', onClick: load }, t('retry'))),
            ),
          ),
        )
      }

      const editor = selected
        ? h(
            'section',
            { className: 'dshp-editor', key: selected.id },
            h(
              'div',
              { className: 'dshp-editor-head' },
              h('div', { className: 'dshp-editor-title' }, Glyph('check', 13), t('editor')),
              model.activeId === selected.id
                ? h('span', { className: 'dshp-badge' }, t('activeNow'))
                : h(
                    'button',
                    {
                      type: 'button',
                      className: 'dshp-btn dshp-btn-ghost',
                      onClick: () => makeDefault(selected.id, true),
                      disabled: busy,
                    },
                    Glyph('star', 12),
                    t('makeDefault'),
                  ),
            ),
            h(
              'div',
              { className: 'dshp-field' },
              h('label', { className: 'dshp-label', htmlFor: 'dshp-name' }, t('nameLabel')),
              h('input', {
                id: 'dshp-name',
                className: 'dshp-input',
                value: selected.name,
                placeholder: t('namePlaceholder'),
                maxLength: 80,
                onChange: (event) => updatePersona(selected.id, { name: event.target.value }),
              }),
            ),
            h(
              'div',
              { className: 'dshp-field' },
              h('label', { className: 'dshp-label', htmlFor: 'dshp-prompt' }, t('promptLabel')),
              h('textarea', {
                id: 'dshp-prompt',
                className: 'dshp-textarea',
                value: selected.prompt,
                placeholder: t('promptPlaceholder'),
                spellCheck: false,
                onChange: (event) => updatePersona(selected.id, { prompt: event.target.value }),
              }),
              h('span', { className: 'dshp-hint' }, t('promptHint')),
            ),
            h(
              'div',
              { className: 'dshp-cot' + (model.chineseCot ? ' is-on' : '') },
              h(
                'div',
                { className: 'dshp-cot-text' },
                h('span', { className: 'dshp-cot-title' }, t('cotTitle')),
                h('span', { className: 'dshp-cot-desc' }, t('cotDesc')),
              ),
              h(
                'button',
                {
                  type: 'button',
                  role: 'switch',
                  'aria-checked': model.chineseCot,
                  'aria-label': t('cotTitle'),
                  className: 'dshp-switch' + (model.chineseCot ? ' is-on' : ''),
                  onClick: () => updateModel((current) => ({ ...current, chineseCot: !current.chineseCot })),
                },
                h('span', { className: 'dshp-switch-knob' }),
              ),
            ),
            h(
              'details',
              { className: 'dshp-advanced' },
              h('summary', null, t('advanced')),
              h(
                'div',
                { className: 'dshp-advanced-body' },
                h('label', { className: 'dshp-label', htmlFor: 'dshp-cot' }, t('cotLabel')),
                h('textarea', {
                  id: 'dshp-cot',
                  className: 'dshp-textarea',
                  style: { minHeight: '132px', marginTop: '8px' },
                  value: model.cotPrompt,
                  spellCheck: false,
                  onChange: (event) => updateModel((current) => ({ ...current, cotPrompt: event.target.value })),
                }),
              ),
            ),
            h(
              'div',
              { className: 'dshp-footer' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'dshp-btn dshp-btn-danger' + (confirmDelete ? ' dshp-btn-ghost' : ''),
                  onClick: deleteSelected,
                  disabled: busy,
                },
                Glyph('trash', 12),
                confirmDelete ? t('confirmDelete') : t('delete'),
              ),
              h('span', { className: 'dshp-footer-spacer' }),
              dirty ? h('span', { className: 'dshp-dirty' }, t('unsaved')) : null,
              h(
                'button',
                {
                  type: 'button',
                  className: 'dshp-btn dshp-btn-primary' + (savedPulse && !dirty ? ' dshp-save-ok' : ''),
                  onClick: saveAll,
                  disabled: busy || !dirty,
                  title: t('hintSave'),
                },
                Glyph('check', 12),
                busy ? t('saving') : t('save'),
              ),
            ),
          )
        : h(
            'section',
            { className: 'dshp-editor' },
            h(
              'div',
              { className: 'dshp-empty' },
              h('span', { className: 'dshp-empty-glyph' }, Glyph('star', 20)),
              h('span', null, t('emptyList')),
              h('button', { type: 'button', className: 'dshp-btn dshp-btn-primary', onClick: addPersona }, Glyph('plus', 12), t('create')),
            ),
          )

      return h(
        'div',
        { className: 'dshp-root' },
        h(
          'div',
          { className: 'dshp-inner' },
          h(
            'header',
            { className: 'dshp-header' },
            h(
              'div',
              null,
              h('div', { className: 'dshp-eyebrow' }, t('eyebrow')),
              h('h1', { className: 'dshp-title' }, t('title')),
              h('p', { className: 'dshp-subtitle' }, t('subtitle')),
            ),
            h(
              'div',
              { className: 'dshp-status', title: activePersona ? activePersona.name : t('untitled') },
              h('span', { className: 'dshp-status-dot' }),
              h('span', null, t('current') + '：'),
              h('b', null, activePersona ? activePersona.name || t('untitled') : t('untitled')),
            ),
          ),
          h(
            'div',
            { className: 'dshp-grid' },
            h(
              'aside',
              null,
              h(
                'div',
                { className: 'dshp-list-head' },
                h('span', { className: 'dshp-list-title' }, t('personas')),
                h(
                  'button',
                  { type: 'button', className: 'dshp-btn dshp-btn-ghost', onClick: addPersona, disabled: busy },
                  Glyph('plus', 12),
                  t('create'),
                ),
              ),
              model.personas.length === 0
                ? h('div', { className: 'dshp-empty' }, h('span', { className: 'dshp-empty-glyph' }, Glyph('star', 20)), t('emptyList'))
                : h(
                    'ul',
                    { className: 'dshp-cards' },
                    model.personas.map((persona, index) =>
                      h(
                        'li',
                        {
                          key: persona.id,
                          className:
                            'dshp-card' +
                            (persona.id === selectedId ? ' is-selected' : '') +
                            (persona.id === model.activeId ? ' is-active' : ''),
                          style: { animationDelay: Math.min(index * 30, 240) + 'ms' },
                        },
                        h(
                          'button',
                          {
                            type: 'button',
                            className: 'dshp-card-main',
                            'aria-pressed': persona.id === selectedId,
                            onClick: () => {
                              setSelectedId(persona.id)
                              setConfirmDelete(false)
                            },
                          },
                          h(
                            'span',
                            { className: 'dshp-card-name' },
                            h('span', null, persona.name || t('untitled')),
                            persona.id === model.activeId ? h('span', { className: 'dshp-badge' }, t('defaultBadge')) : null,
                          ),
                          h('span', { className: 'dshp-card-preview' }, preview(persona.prompt, t('emptyPrompt'))),
                        ),
                        persona.id === model.activeId
                          ? null
                          : h(
                              'button',
                              {
                                type: 'button',
                                className: 'dshp-star',
                                title: t('makeDefault'),
                                'aria-label': t('makeDefault'),
                                disabled: busy,
                                onClick: () => makeDefault(persona.id, true),
                              },
                              Glyph('star', 13),
                            ),
                      ),
                    ),
                  ),
            ),
            editor,
          ),
          h(
            'footer',
            { className: 'dshp-credit' },
            h('span', { className: 'dshp-credit-heart', 'aria-hidden': true }, Glyph('heart', 11)),
            h('span', null, t('credit')),
          ),
        ),
        toast
          ? h(
              'div',
              {
                className:
                  'dshp-toast' + (toast.kind === 'warn' ? ' is-warn' : toast.kind === 'error' ? ' is-error' : ''),
                role: 'status',
                'aria-live': 'polite',
                key: toast.id,
              },
              toast.kind === 'success' ? Glyph('check', 13) : toast.kind === 'error' ? Glyph('alert', 13) : null,
              toast.text,
            )
          : null,
      )
    }

    return {
      inject: ['slots', 'locale', 'remote', 'remote.settings'],
      apply(ctx) {
        try {
          console.info(
            '%c dsh-persona %c 彻柑可可制作 · 以爱发电 ',
            'background:#4d6bfe;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px;font-weight:600',
            'background:#eef2ff;color:#4d6bfe;border-radius:0 4px 4px 0;padding:2px 6px',
          )
        } catch {}
        const releaseStyles = mountStyle()
        ctx.effect(() => releaseStyles, 'dsh-persona: styles')
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-persona: dictionaries')
        const t = ctx.locale.bind(NS)

        const api = {
          async read() {
            const response = await ctx.remote.settings.describe()
            if (!response.ok) throw new Error(response.error.message)
            const namespaces = response.value && Array.isArray(response.value.namespaces) ? response.value.namespaces : []
            return namespaces.find((namespace) => namespace.ns === ENTRY_ID) || null
          },
          async write(value, revision) {
            const ops = FIELDS.map((field) => ({ op: 'set', path: [field], value: value[field] }))
            const response = await ctx.remote.settings.mutate(ENTRY_ID, ops, revision)
            if (response.ok) return { kind: 'ok', view: response.value }
            const code = response.error && response.error.code
            const conflict = code === 'settings-conflict' || code === 'settings/conflict' || /changed since/i.test(String(response.error && response.error.message))
            return { kind: conflict ? 'conflict' : 'refused', message: response.error && response.error.message }
          },
        }

        ctx.slots.inject('main', () =>
          ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS, inject: () => ({ persona: api }) }, PersonaPage),
        )
        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: -10, locale: NS, label: () => t('panel') }, PersonaIcon),
        )
      },
    }
  },
})

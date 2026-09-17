import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const chrome = process.argv[2]
const url = process.argv[3] || 'http://localhost:3000/'
const port = 9333

const child = spawn(chrome, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=' + process.env.TEMP + '\\bw-chrome-debug',
  'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] })

child.stderr.on('data', (d) => {
  const s = d.toString()
  if (s.includes('Unexpected') || s.includes('error')) process.stdout.write('[chrome] ' + s)
})

async function waitJson(path) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}${path}`)
      if (res.ok) return await res.json()
    } catch {}
    await delay(250)
  }
  throw new Error('CDP not ready')
}

const targets = await waitJson('/json/list')
const pageTarget = targets.find((t) => t.type === 'page') || targets[0]
console.log('TARGET', pageTarget?.type, pageTarget?.url, pageTarget?.webSocketDebuggerUrl)
if (!pageTarget?.webSocketDebuggerUrl) {
  console.log('targets', targets)
  throw new Error('no page target')
}
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve)
  ws.addEventListener('error', reject)
})

let id = 0
const pending = new Map()
const logs = []
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const text = (msg.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ')
    logs.push(['console', msg.params.type, text])
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    logs.push(['exception', msg.params.exceptionDetails?.text, msg.params.exceptionDetails?.exception?.description])
  }
})

function send(method, params = {}) {
  const current = ++id
  ws.send(JSON.stringify({ id: current, method, params }))
  return new Promise((resolve) => pending.set(current, resolve))
}

await send('Runtime.enable')
await send('Page.enable')
await send('Network.enable')
const nav = await send('Page.navigate', { url })
console.log('NAV', JSON.stringify(nav.result || nav))
await delay(8000)

await delay(4000)

const evalRes = await send('Runtime.evaluate', {
  expression: `(() => {
    const portal = document.querySelector('nextjs-portal')
    const err = portal?.shadowRoot?.querySelector('h1, [data-nextjs-dialog-header], [data-nextjs-error-overlay]')
    return {
      title: document.title,
      href: location.href,
      hasPortal: !!portal,
      errorText: (err?.textContent || '').slice(0, 1500),
      overlayHasError: /Unexpected|JSON|error/i.test(portal?.shadowRoot?.textContent || ''),
      h1: document.querySelector('h1')?.innerText || null,
      preview: document.body?.innerText?.includes('TU COMENTARIO') || document.body?.innerText?.includes('YOUR COMMENT'),
      bodyStart: (document.body?.innerText || '').slice(0, 400),
    }
  })()`,
  returnByValue: true,
  awaitPromise: false,
})

console.log('EVAL RAW', JSON.stringify(evalRes, null, 2).slice(0, 4000))
console.log('LOGS', logs.length)
for (const row of logs) console.log(JSON.stringify(row).slice(0, 1000))

ws.close()
child.kill()
process.exit(0)

async function dump(label, headers) {
  const res = await fetch('http://localhost:3000/opiniones', { headers })
  const body = await res.text()
  console.log('\n====', label, '====')
  console.log('status', res.status, 'type', res.headers.get('content-type'), 'bytes', body.length)
  console.log(body.slice(0, 500) || '(empty)')
}

await dump('html', {})
await dump('rsc', { RSC: '1' })
await dump('prefetch', { RSC: '1', 'Next-Router-Prefetch': '1' })
await dump('tree', {
  RSC: '1',
  'Next-Router-Prefetch': '1',
  'next-router-segment-prefetch': '/_tree',
  'Next-Url': '/',
})
await dump('full', {
  RSC: '1',
  'next-router-segment-prefetch': '/_full',
  'Next-Url': '/',
})
await dump('page-segment', {
  RSC: '1',
  'Next-Router-Prefetch': '1',
  'next-router-segment-prefetch': '/__PAGE__',
  'Next-Url': '/',
})
await dump('opiniones-segment', {
  RSC: '1',
  'Next-Router-Prefetch': '1',
  'next-router-segment-prefetch': '/opiniones',
  'Next-Url': '/',
})
await dump('nested', {
  RSC: '1',
  'Next-Router-Prefetch': '1',
  'next-router-segment-prefetch': '/[lang]/opiniones',
  'Next-Url': '/',
})

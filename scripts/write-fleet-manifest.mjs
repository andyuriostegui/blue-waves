import fs from 'node:fs'
import path from 'node:path'

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

export function writeFleetManifest(root = process.cwd()) {
  const publicDir = path.join(root, 'public')
  const found = {}

  for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const names = fs.readdirSync(path.join(publicDir, entry.name))
    const files = names
      .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'es'))
    if (files.length > 0) found[entry.name] = files
  }

  const manifest = Object.fromEntries(
    Object.keys(found)
      .sort((a, b) => a.localeCompare(b, 'es'))
      .map((folder) => [folder, found[folder]]),
  )
  const dest = path.join(root, 'lib', 'fleet-manifest.json')
  const next = `${JSON.stringify(manifest, null, 2)}\n`
  const prev = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : ''
  if (prev !== next) fs.writeFileSync(dest, next)
  return manifest
}

writeFleetManifest()

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const MINIMUM_PATCHED = [11, 11, 0]
const MAXIMUM_EXCLUSIVE = [12, 0, 0]
const manifests = [
  'dsh-plugin-desktop/package.json',
  'dsh-plugin-desktop-beta/package.json',
]

function parseExactVersion(value) {
  assert.match(value, /^\d+\.\d+\.\d+$/u, `pnpm must be pinned to an exact version, got ${JSON.stringify(value)}`)
  return value.split('.').map(part => Number.parseInt(part, 10))
}

function compare(a, b) {
  for (let index = 0; index < 3; index += 1) {
    const delta = a[index] - b[index]
    if (delta !== 0) return Math.sign(delta)
  }
  return 0
}

test('desktop packages pin one patched pnpm 11 release', () => {
  const versions = manifests.map(filename => {
    const manifest = JSON.parse(readFileSync(filename, 'utf8'))
    const value = manifest.dependencies?.pnpm
    assert.equal(typeof value, 'string', `${filename} must declare pnpm as a runtime dependency`)
    const parsed = parseExactVersion(value)
    assert.ok(compare(parsed, MINIMUM_PATCHED) >= 0, `${filename} uses vulnerable pnpm ${value}; require >=11.11.0`)
    assert.ok(compare(parsed, MAXIMUM_EXCLUSIVE) < 0, `${filename} must stay on pnpm 11 for this MVP migration`)
    return value
  })

  assert.equal(new Set(versions).size, 1, `stable and beta must pin the same pnpm version: ${versions.join(', ')}`)
})

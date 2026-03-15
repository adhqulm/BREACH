export class Filesystem {
  constructor(levelData) {
    this.dirs  = new Set(levelData.dirs || ['/'])
    this.files = levelData.files || {}
  }

  resolve(cwd, input) {
    if (!input || input === '') return cwd
    let path = input.startsWith('/') ? input : cwd.replace(/\/?$/, '/') + input
    const parts = path.split('/').filter(Boolean)
    const resolved = []
    for (const p of parts) {
      if (p === '.') continue
      if (p === '..') { resolved.pop(); continue }
      resolved.push(p)
    }
    return '/' + resolved.join('/')
  }

  isDir(path) {
    return this.dirs.has(path === '' ? '/' : path)
  }

  isFile(path) {
    return Object.prototype.hasOwnProperty.call(this.files, path)
  }

  read(path) {
    return this.files[path] ?? null
  }


  list(dirPath, { showHidden = false } = {}) {
    const base = dirPath.replace(/\/?$/, '/')
    const results = new Map()

    for (const d of this.dirs) {
      if (d === dirPath) continue
      const rel = d.startsWith(base) ? d.slice(base.length) : null
      if (rel && !rel.includes('/') && rel.length > 0) {
        results.set(rel, true)
      }
    }

    for (const filePath of Object.keys(this.files)) {
      const rel = filePath.startsWith(base) ? filePath.slice(base.length) : null
      if (rel && !rel.includes('/') && rel.length > 0) {
        results.set(rel, false)
      }
    }

    return [...results.entries()]
      .filter(([name]) => showHidden || !name.startsWith('.'))
      .sort((a, b) => {
        if (a[1] !== b[1]) return a[1] ? -1 : 1
        return a[0].localeCompare(b[0])
      })
      .map(([name, isDir]) => ({ name, isDir }))
  }
}

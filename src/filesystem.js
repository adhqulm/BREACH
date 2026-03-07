/**
 * Fake filesystem for each level.
 *
 * Structure:
 *   dirs:  array of directory paths (always includes '/')
 *   files: object of { '/path/to/file.txt': 'content string' }
 */

export class Filesystem {
  constructor(levelData) {
    this.dirs  = new Set(levelData.dirs || ['/'])
    this.files = levelData.files || {}
  }

  /** Normalise a path: collapse //, resolve . and .. */
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

  /** Read file content. Returns null if not found. */
  read(path) {
    return this.files[path] ?? null
  }

  /**
   * List contents of a directory.
   * Returns array of { name, isDir } sorted dirs-first.
   * Pass { showHidden: true } to include dotfiles.
   */
  list(dirPath, { showHidden = false } = {}) {
    const base = dirPath.replace(/\/?$/, '/')  // ensure trailing slash for comparison
    const results = new Map()

    // Check sub-directories
    for (const d of this.dirs) {
      if (d === dirPath) continue
      // Is d a direct child of dirPath?
      const rel = d.startsWith(base) ? d.slice(base.length) : null
      if (rel && !rel.includes('/') && rel.length > 0) {
        results.set(rel, true)
      }
    }

    // Check files
    for (const filePath of Object.keys(this.files)) {
      const rel = filePath.startsWith(base) ? filePath.slice(base.length) : null
      if (rel && !rel.includes('/') && rel.length > 0) {
        results.set(rel, false)
      }
    }

    // Sort: dirs first, then files, alpha. Filter hidden unless requested.
    return [...results.entries()]
      .filter(([name]) => showHidden || !name.startsWith('.'))
      .sort((a, b) => {
        if (a[1] !== b[1]) return a[1] ? -1 : 1
        return a[0].localeCompare(b[0])
      })
      .map(([name, isDir]) => ({ name, isDir }))
  }
}

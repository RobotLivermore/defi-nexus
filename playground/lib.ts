import fs from 'fs'

export class LogReader {
  contract: string = ''
  constructor(_contract: string) {
    this.contract = _contract.toLowerCase()
    const logMetadata = JSON.parse(
      fs.readFileSync('./data/logMetadata.json', 'utf-8')
    )
    if (!logMetadata[this.contract]) {
      throw new Error('contract not exist')
    } else {
      const files = logMetadata[this.contract].files
      const dirFiles = fs.readdirSync(`./data/${this.contract}`)
      files.forEach((file: string) => {
        if (!dirFiles.includes(file)) {
          console.log('file not exist', file)
        }
      })
      dirFiles.forEach((file: string) => {
        if (!files.includes(file)) {
          console.log('file not exist in logMetadata', file)
        }
      })
    }
  }

  forEach(fn: (log: any) => void, options?: { log?: boolean }) {
    const files = JSON.parse(
      fs.readFileSync(`./data/logMetadata.json`, 'utf-8')
    )[this.contract].files

    files.forEach((file: string, index: number) => {
      if (options?.log !== false) {
        console.log(
          'file read progress',
          ((index / files.length) * 100).toFixed(2) + '%'
        )
      }
      const logs = JSON.parse(
        fs.readFileSync(`./data/${this.contract}/${file}`, 'utf-8')
      )
      logs.forEach(fn)
    })
  }
}

export class Counter {
  map: Record<string, number> = {}
  constructor() {
    this.map = {}
  }

  add(key: string) {
    if (!this.map[key]) {
      this.map[key] = 1
    } else {
      this.map[key]++
    }
  }

  get(key: string) {
    return this.map[key]
  }

  export() {
    const result: [string, number][] = []
    for (const key in this.map) {
      result.push([key, this.map[key]])
    }
    return result.sort((a, b) => b[1] - a[1])
  }
}

export const decodeBlockNumber = (blockNumber: string) => {
  return parseInt(blockNumber, 16)
}


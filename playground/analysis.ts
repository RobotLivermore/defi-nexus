import fs from 'fs'
import Bignumber from 'bignumber.js'

class LogReader {
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

  forEach(fn: (log: any) => void, options?: { log?: boolean}) {
    const files = JSON.parse(
      fs.readFileSync(`./data/logMetadata.json`, 'utf-8')
    )[this.contract].files

    files.forEach((file: string, index: number) => {
      if (options?.log !== false) {
        console.log('file read progress', (index / files.length *  100).toFixed(2) + '%')
      }
      const logs = JSON.parse(
        fs.readFileSync(`./data/${this.contract}/${file}`, 'utf-8')
      )
      logs.forEach(fn)
    })
  }
}

class Counter {
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

const decodeBlockNumber = (blockNumber: string) => {
  return parseInt(blockNumber, 16)
}

const main = async () => {
  const logReader = new LogReader('0xC8ee91A54287DB53897056e12D9819156D3822Fb')

  // // 1. 统计每个事件的次数
  // const counter = new Counter()
  // logReader.forEach((log) => {
  //   counter.add(log.eventName)
  // })
  // const result = counter.export()
  // fs.writeFileSync('./data/analysis/eventCount.json', JSON.stringify(result, null, 2))

  // 2. 统计MarketPoolValueInfo
  const marketTokenValueMap: Record<string, { blockNumber: number; tokenPrice: number}[]> = {}
  logReader.forEach((log) => {
    if (log.eventName === 'MarketPoolValueInfo') {
      if (!marketTokenValueMap[log.market.toLowerCase()]) {
        marketTokenValueMap[log.market.toLowerCase()] = []
        console.log(log)
      }
      if (log.poolValue === '0' || log.marketTokensSupply === '0') {
        return
      }
      marketTokenValueMap[log.market.toLowerCase()].push({
        blockNumber: decodeBlockNumber(log.blockNumber),
        tokenPrice:  Number(Bignumber(log.poolValue).div(Bignumber(log.marketTokensSupply)).div(Bignumber(10).pow(12)).toNumber().toFixed(4)),
      })
    }
  }, { log: false })
  fs.writeFileSync('./data/analysis/marketTokenValueMap.json', JSON.stringify(marketTokenValueMap, null, 2))


}

main()

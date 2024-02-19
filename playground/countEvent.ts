import fs from 'fs'
import Bignumber from 'bignumber.js'
import { LogReader, Counter, decodeBlockNumber } from './lib'

const main = async () => {
  const logReader = new LogReader('0xC8ee91A54287DB53897056e12D9819156D3822Fb')

  // 1. 统计每个事件的次数
  const counter = new Counter()
  logReader.forEach((log) => {
    counter.add(log.eventName)
  })
  const result = counter.export()
  fs.writeFileSync('./data/analysis/eventCount.json', JSON.stringify(result, null, 2))
}

main()
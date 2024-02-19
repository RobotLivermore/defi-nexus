import fs from 'fs'
import Bignumber from 'bignumber.js'
import { LogReader, Counter, decodeBlockNumber } from './lib'

const main = async () => {
  const logReader = new LogReader('0xC8ee91A54287DB53897056e12D9819156D3822Fb')

  // 3. 获得marketInfo
  const marketInfoMap: Record<
    string,
    {
      marketToken: string
      indexToken: string
      longToken: string
      shortToken: string
    }
  > = {}
  logReader.forEach(
    (log) => {
      if (log.eventName === 'MarketCreated') {
        marketInfoMap[log.marketToken.toLowerCase()] = {
          marketToken: log.marketToken,
          indexToken: log.indexToken,
          longToken: log.longToken,
          shortToken: log.shortToken,
        }
      }
    },
    { log: true }
  )
  fs.writeFileSync(
    './data/analysis/marketInfoMap.json',
    JSON.stringify(marketInfoMap, null, 2)
  )
}

main()

import fs from 'fs'
import Bignumber from 'bignumber.js'
import { LogReader, Counter, decodeBlockNumber } from './lib'

const main = async () => {
  const logReader = new LogReader('0xC8ee91A54287DB53897056e12D9819156D3822Fb')

  // 2. 统计MarketPoolValueInfo
  const marketTokenValueMap: Record<
    string,
    { blockNumber: number; tokenPrice: number }[]
  > = {}
  logReader.forEach(
    (log) => {
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
          tokenPrice: Number(
            Bignumber(log.poolValue)
              .div(Bignumber(log.marketTokensSupply))
              .div(Bignumber(10).pow(12))
              .toNumber()
              .toFixed(4)
          ),
        })
      }
    },
    { log: false }
  )
  fs.writeFileSync(
    './data/analysis/marketTokenValueMap.json',
    JSON.stringify(marketTokenValueMap, null, 2)
  )
}

main()

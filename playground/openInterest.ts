import fs from 'fs'
import Bignumber from 'bignumber.js'
import { LogReader, Counter, decodeBlockNumber } from './lib'

const main = async () => {
  const logReader = new LogReader('0xC8ee91A54287DB53897056e12D9819156D3822Fb')

  // "market": "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336",
  // "collateralToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  // "nextValue": "30597178868101302280131416074336970000",
  // "delta": "-36370339957546596787500000000000000",
  // "isLong": false,
  const marketTokenValueMap: Record<
    string,
    {
      blockNumber: number
      market: string
      collateralToken: string
      nextValue: string
      delta: string
      isLong: string
    }[]
  > = {}
  logReader.forEach(
    (log) => {
      if (log.eventName === 'OpenInterestUpdated') {
        if (!marketTokenValueMap[log.market.toLowerCase()]) {
          marketTokenValueMap[log.market.toLowerCase()] = []
        }
        if (log.poolValue === '0' || log.marketTokensSupply === '0') {
          return
        }
        marketTokenValueMap[log.market.toLowerCase()].push({
          blockNumber: decodeBlockNumber(log.blockNumber),
          market: log.market,
          collateralToken: log.collateralToken,
          nextValue: log.nextValue,
          delta: log.delta,
          isLong: log.isLong,
        })
      }
    },
    { log: true }
  )
  fs.writeFileSync(
    './data/analysis/openInterestUpdate.json',
    JSON.stringify(marketTokenValueMap, null, 2)
  )
}

main()

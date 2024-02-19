import fs from 'fs'
import Bignumber from 'bignumber.js'
import { LogReader, Counter, decodeBlockNumber } from './lib'

const main = async () => {
  const logReader = new LogReader('0xC8ee91A54287DB53897056e12D9819156D3822Fb')

  // 4. 获得indexToken价格数据
  const markInfoMap = JSON.parse(
    fs.readFileSync('./data/analysis/marketInfoMap.json', 'utf-8')
  )
  console.log('markInfoMap', markInfoMap)
  const indexTokenPriceMap: Record<
    string,
    {
      blockNumber: number
      minPrice: string
      maxPrice: string
      timestamp: string
    }[]
  > = {}
  logReader.forEach(
    (log) => {
      if (log.eventName === 'OraclePriceUpdate') {
        if (!indexTokenPriceMap[log.token.toLowerCase()]) {
          indexTokenPriceMap[log.token.toLowerCase()] = []
        }
        indexTokenPriceMap[log.token.toLowerCase()].push({
          blockNumber: decodeBlockNumber(log.blockNumber),
          minPrice: log.minPrice,
          maxPrice: log.maxPrice,
          timestamp: log.timestamp,
        })
      }
    },
    { log: true }
  )

  Object.keys(indexTokenPriceMap).forEach((key) => {
    console.log(key)
    const output = indexTokenPriceMap[key]
    const info = Object.values(markInfoMap).find(
      (item: any) => item.indexToken.toLowerCase() === key
    ) as any
    if (!info) {
      fs.writeFileSync(
        `./data/analysis/price_${key}.json`,
        JSON.stringify(output, null, 2)
      )
      return
    }
    fs.writeFileSync(
      `./data/analysis/price_${info.tokenSymbol}.json`,
      JSON.stringify(output, null, 2)
    )
  })
}

main()
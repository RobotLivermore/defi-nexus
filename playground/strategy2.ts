import BigNumber from 'bignumber.js'
import fs from 'fs'

// 先实现一个模拟开平仓的类
class MockMarket {
  position: number = 0
  profit: number = 0

  constructor() {}
  open(amount: number, price: number) {
    this.position += amount
    this.profit -= amount * price
  }
  getPosition() {
    return [this.position, this.profit]
  }
  settle(price: number) {
    return this.position * price + this.profit
  }
}

class CursorReader {
  cursor: number = 0
  data: { index: number; value: number }[] = []

  constructor(data: { index: number; value: number }[]) {
    this.data = data
  }

  read(id: number) {
    if (this.cursor === this.data.length - 1) {
      return this.data[this.cursor].value
    }

    while (
      this.data[this.cursor + 1] &&
      this.data[this.cursor + 1].index <= id
    ) {
      this.cursor++

      if (this.cursor === this.data.length - 1) {
        return this.data[this.cursor].value
      }
    }
    return this.data[this.cursor].value
  }
}

const main = async () => {
  const data = JSON.parse(
    fs.readFileSync('./data/analysis/openInterestInTokenUpdate.json', 'utf-8')
  )
  const longOpenInterest1 = new CursorReader(
    data['0x70d95587d40a2caf56bd97485ab3eec10bee6336-long']
      .filter(
        (log: any) =>
          log.collateralToken === '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
      )
      .map((log: any) => ({
        index: log.blockNumber,
        value: BigNumber(log.nextValue).div(BigNumber(10).pow(18)).toNumber(),
      }))
  )
  const longOpenInterest2 = new CursorReader(
    data['0x70d95587d40a2caf56bd97485ab3eec10bee6336-long']
      .filter(
        (log: any) =>
          log.collateralToken === '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
      )
      .map((log: any) => ({
        index: log.blockNumber,
        value: BigNumber(log.nextValue).div(BigNumber(10).pow(18)).toNumber(),
      }))
  )
  const shortOpenInterest1 = new CursorReader(
    data['0x70d95587d40a2caf56bd97485ab3eec10bee6336-short']
      .filter(
        (log: any) =>
          log.collateralToken === '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
      )
      .map((log: any) => ({
        index: log.blockNumber,
        value: BigNumber(log.nextValue).div(BigNumber(10).pow(18)).toNumber(),
      }))
  )
  const shortOpenInterest2 = new CursorReader(
    data['0x70d95587d40a2caf56bd97485ab3eec10bee6336-short']
      .filter(
        (log: any) =>
          log.collateralToken === '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
      )
      .map((log: any) => ({
        index: log.blockNumber,
        value: BigNumber(log.nextValue).div(BigNumber(10).pow(18)).toNumber(),
      }))
  )

  const data2 = JSON.parse(
    fs.readFileSync('./data/analysis/marketTokenValueMap.json', 'utf-8')
  )
  const market = new MockMarket()
  const profitList = data2['0x70d95587d40a2caf56bd97485ab3eec10bee6336'].map(
    (log: any) => {
      const [position] = market.getPosition()
      const deltaOpenInterest =
        (longOpenInterest1.read(log.blockNumber) +
          longOpenInterest2.read(log.blockNumber) -
          shortOpenInterest1.read(log.blockNumber) -
          shortOpenInterest2.read(log.blockNumber)) /
        Math.max(log.marketTokensSupply, 10000)

      market.open(
        deltaOpenInterest - (log.longTokenAmount + position),
        log.longTokenPrice
      )

      return {
        blockNumber: log.blockNumber,
        value: market.settle(log.longTokenPrice) + log.tokenPrice,
        longTokenAmount: log.longTokenAmount,
        longOpenInterest1: longOpenInterest1.read(log.blockNumber),
        longOpenInterest2: longOpenInterest2.read(log.blockNumber),
        shortOpenInterest1: shortOpenInterest1.read(log.blockNumber),
        shortOpenInterest2: shortOpenInterest2.read(log.blockNumber),
        deltaOpenInterest,
      }
    }
  )
  fs.writeFileSync(
    './data/analysis/marketProfitList2.json',
    JSON.stringify(profitList, null, 2)
  )
  console.log('max deltaOpenInterest',Math.max(...profitList.map((item: any) => item.deltaOpenInterest)))
}

main()

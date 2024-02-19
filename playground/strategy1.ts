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

const test = async () => {
  const market = new MockMarket()
  market.open(-1, 100)
  console.log('settle 100', market.settle(100), 0)
  console.log('settle 101', market.settle(101), -1)
  console.log('settle 99', market.settle(99), 1)
  market.open(1, 100)
  console.log('settle 100', market.settle(100), 0)
  console.log('position', market.getPosition(), [0,0])
  market.open(1, 100)
  market.open(-0.1, 101)
  console.log(market.settle(103))
}

const main = async () => {
  const data = JSON.parse(fs.readFileSync('./data/analysis/marketTokenValueMap.json', 'utf-8'))
  console.log(data['0x70d95587d40a2caf56bd97485ab3eec10bee6336'].length)
  const market = new MockMarket()
  const profitList = data['0x70d95587d40a2caf56bd97485ab3eec10bee6336'].map((log: any) => {
    const [position, ] = market.getPosition()
    market.open(-(log.longTokenAmount + position), log.longTokenPrice)
    return {
      blockNumber: log.blockNumber,
      value: market.settle(log.longTokenPrice) + log.tokenPrice
    }
  })
  fs.writeFileSync('./data/analysis/marketProfitList.json', JSON.stringify(profitList, null, 2))
}

main()
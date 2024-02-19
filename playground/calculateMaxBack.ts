// 计算最大回撤
import fs from 'fs'

function calculateMaximumDrawdown(prices: number[]): number {
  // 初始化最大回撤和最高点
  let maxDrawdown: number = 0
  let peak: number = prices[0]

  for (const price of prices) {
    // 如果当前价格高于之前的最高点，则更新最高点
    if (price > peak) {
      peak = price
    }
    // 计算从最高点到当前点的跌幅
    const drawdown: number = (peak - price) / peak

    // 如果这个跌幅大于之前记录的最大回撤，则更新最大回撤
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  return maxDrawdown
}

const data = JSON.parse(
  fs.readFileSync('./data/analysis/marketProfitList.json', 'utf-8')
)
// 示例数组
const prices: number[] = data.map((d: any) => d.value)
// 计算最大回撤
const maxDrawdown: number = calculateMaximumDrawdown(prices)
// 以百分比形式输出最大回撤
console.log(`Maximum Drawdown: ${(maxDrawdown * 100).toFixed(2)}%`)

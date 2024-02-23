import { decodeFunctionData } from 'viem'
import { arbitrum } from 'viem/chains'
import exchangeRouterAbi from './abi/exchangeRouter.json'

const getTxByHash = async (txHash: string) => {
  const resp = await fetch('https://arb1.arbitrum.io/rpc', {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionByHash',
      params: [txHash],
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const json = await resp.json()
  return json.result
}

const main = async () => {
  const result = await getTxByHash(
    '0xf12b5349c6b4554173ba3e743d5f91e97c0af4b003561f1d1043e38486cd4df6'
  )
  console.log('result', result)
  const parsedData = decodeFunctionData({
    abi: exchangeRouterAbi,
    data: result.input,
  })
  console.log('parsedData', parsedData)
  if (parsedData.functionName === 'multicall' && parsedData.args) {
    const calls = parsedData.args[0] as string[]
    calls.forEach((bytes) => {
      const parsed = decodeFunctionData({
        abi: exchangeRouterAbi,
        data: bytes as any,
      })
      console.log(
        'parsed',
        JSON.stringify(
          parsed,
          (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          2
        )
      )
    })
  }
}

main()

import fs from 'fs'

let id = 1

const fetchBlock = async (
  infuraKey: string,
  network: string,
  blockNumber: string,
) => {
  const response = await fetch(`https://${network}.infura.io/v3/${infuraKey}`, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: id++,
      method: 'eth_getBlockByNumber',
      params: [
        blockNumber,
        false,
      ],
    }),
  })
  const json = await response.json()
  return json
}

const main = async () => {
  const infuraKey = process.env.INFURA_KEY as string
  const network = 'arbitrum-mainnet'
  const blockNumber = '0x88F11EF'
  const blockInfo = await fetchBlock(infuraKey, network, blockNumber)
  console.log('blockInfo', blockInfo)
}

main()
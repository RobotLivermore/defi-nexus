import { decodeEventLog } from 'viem'
import fs from 'fs'
import eventemitterAbi from './abi/eventemitter.json'

let id = 1

const simpleFetchLogs = async (
  infuraKey: string,
  network: string,
  contract: string,
  topics: (string | null)[],
  fromBlock: string,
  toBlock: string
) => {
  const response = await fetch(`https://${network}.infura.io/v3/${infuraKey}`, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: id++,
      method: 'eth_getLogs',
      params: [
        {
          address: contract,
          fromBlock: fromBlock,
          toBlock: toBlock,
          topics: topics || [],
        },
      ],
    }),
  })
  const json = await response.json()
  return json
}

const wrappedFetchLogs = async (
  infuraKey: string,
  network: string,
  contract: string,
  topics: (string | null)[],
  addLog: (log: string) => void,
  addData: (data: any[], from: string, to: string) => void,
  _fromBlock: string = '0x0',
) => {
  addLog('Start Fetching logs...')
  let fromBlock = _fromBlock
  let toBlock = 'latest'
  while (true) {
    addLog(`Fetching Range:[${fromBlock}, ${toBlock}]`)
    const response = await simpleFetchLogs(
      infuraKey,
      network,
      contract,
      topics,
      fromBlock,
      toBlock
    )
    if (response.error) {
      if (response.error.code === -32005) {
        fromBlock = response.error.data.from
        toBlock = response.error.data.to
        addLog(
          `Got rate limited, retrying from block ${fromBlock} to block ${toBlock}...`
        )
        continue
      } else {
        addLog(`Error fetching logs:${response.error.message}`)
        break
      }
    } else {
      addData(response.result, fromBlock, toBlock)
      if (toBlock !== 'latest') {
        // fromBlock = `0x${(parseInt(toBlock, 16) + 1).toString(16)}`
        fromBlock = toBlock
        toBlock = 'latest'
        continue
      }
    }
    break
  }
  addLog('Logs fetched')
}

const parseEventData = (parsedLog: any) => {
  const res: any = {}
  const keys = [
    'addressItems',
    'uintItems',
    'intItems',
    'boolItems',
    'bytes32Items',
    'bytesItems',
    'stringItems',
  ]
  keys.forEach((key) => {
    if (parsedLog.args.eventData[key]) {
      if (parsedLog.args.eventData[key].items) {
        parsedLog.args.eventData[key].items.forEach((item: any) => {
          res[item.key] = item.value
        })
      }
      if (parsedLog.args.eventData[key].arrayItems) {
        parsedLog.args.eventData[key].arrayItems.forEach((item: any) => {
          res[item.key] = item.value
        })
      }
    }
  })
  return res
}

async function syncAllLogs(contract: string) {
  let logMetadata: Record<string, {files: string[]}> = {}
  // 查看文件夹
  const files = fs.readdirSync('./data')
  if (files.includes('logMetadata.json')) {
    logMetadata = JSON.parse(fs.readFileSync('./data/logMetadata.json', 'utf-8'))
  }
  if (!files.includes(contract.toLowerCase())) {
    fs.mkdirSync(`./data/${contract.toLowerCase()}`)
  }
  console.log(files)
  const addData = (result: any[], from: string, to: string) => {
    if (!logMetadata[contract.toLowerCase()]) {
      logMetadata[contract.toLowerCase()] = { files: [] }
    }

    const newLogs: any[] = []
    result.forEach((log: any) => {
      // console.log(log)
      const parsedLog = decodeEventLog({
        data: log.data,
        topics: log.topics,
        abi: eventemitterAbi,
      }) as any
      const eventData = parseEventData(parsedLog)
      eventData.blockNumber = log.blockNumber
      eventData.transactionHash = log.transactionHash
      eventData.logIndex = log.logIndex
      eventData.event = parsedLog.eventName
      eventData.eventName = parsedLog.args.eventName
      eventData.msgSender = parsedLog.args.msgSender
      newLogs.push(eventData)
    })
    fs.writeFileSync(
      `./data/${contract.toLowerCase()}/${from}_${to}.json`,
      JSON.stringify(
        newLogs,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value),
        2
      )
    )
    logMetadata[contract.toLowerCase()].files.push(`${from}_${to}.json`)
    fs.writeFileSync(
      './data/logMetadata.json',
      JSON.stringify(logMetadata, null, 2)
    )
  }

  let fromBlock = '0x0'
  if (logMetadata[contract.toLowerCase()]?.files.length > 0) {
    const lastFile = logMetadata[contract.toLowerCase()].files.pop()
    fromBlock = lastFile!.split('_')[0]
    try {

      fs.rmSync(`./data/${contract.toLowerCase()}/${lastFile}`)
    } catch (e) {
      console.log(e)
    }
  }

  const infuraKey = process.env.INFURA_KEY as string

  await wrappedFetchLogs(
    infuraKey,
    'arbitrum-mainnet',
    '0xC8ee91A54287DB53897056e12D9819156D3822Fb',
    [],
    (log: string) => console.log(log),
    addData,
    fromBlock
  )
  
}

async function main() {
  syncAllLogs('0xC8ee91A54287DB53897056e12D9819156D3822Fb')
}

main()

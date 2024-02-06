import { useCallback, useRef, useState } from 'react'

let id = 1

const simpleFetchLogs = async (
  infuraKey: string,
  network: string,
  contract: string,
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
  addLog: (log: string) => void,
  addData: (data: any[]) => void
) => {
  addLog('Start Fetching logs...')
  let fromBlock = '0x0'
  let toBlock = 'latest'
  while (true) {
    addLog(`Fetching Range:[${fromBlock}, ${toBlock}]`)
    const response = await simpleFetchLogs(
      infuraKey,
      network,
      contract,
      fromBlock,
      toBlock
    )
    console.log(response)
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
      addData(response.result)
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

const useDownloadLogs = () => {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [data, setData] = useState<any[]>([])
  const dataIdSet = useRef(new Set<string>())


  const addLog = useCallback((log: string) => {
    setLogs((prev) => [...prev, log])
  }, [])

  const addData = useCallback((data: any[]) => {
    const newData: any[] = []
    data.forEach((d) => {
      const id = d.blockNumber + d.logIndex
      console.log(dataIdSet.current.size, id)
      
      if (!dataIdSet.current.has(id)) {
        dataIdSet.current.add(id)
        newData.push(d)
      } else {
        console.log('Duplicated log:', d)
      }
    })

    setData((prev) => [...prev, ...newData])
  }, [])

  const resetLogs = useCallback(() => {
    setLogs([])
  }, [])

  const downloadLogs = useCallback(
    async (infuraKey: string, network: string, contract: string) => {
      try {
        setLoading(true)
        const data = await wrappedFetchLogs(
          infuraKey,
          network,
          contract,
          addLog,
          addData
        )
        console.log(data)
        
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [addData, addLog]
  )

  return {
    downloading: loading,
    logs,
    data,
    downloadLogs,
  }
}

export default useDownloadLogs

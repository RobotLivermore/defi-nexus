'use client'

import { getPrimayButtonClasses } from '@/css/button'
import React, { FC, useState } from 'react'
import useDownloadLogs from './useDownloadLogs'
import { getDefaultInputClasses } from '@/css/input'
import useLocalStorage from '@/hooks/useLocalstorage'

const infuraNetworks = [
  'arbitrum-mainnet',
  'avalanche-mainnet',
  'mainnet',
  'polygon-mainnet',
  'starknet-mainnet',
  'celo-mainnet',
]

const Downloader: FC = () => {
  const [infuraKey, setInfuraKey] = useLocalStorage<string>(
    'evm-logs-downloader.infuraKey',
    ''
  )
  const [contractAddress, setContractAddress] = useState<string>('')
  const [network, setNetwork] = useState<string>('mainnet')

  const { downloading, downloadLogs, logs, data } = useDownloadLogs()

  const downloadData = () => {
    // download json data
    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logs.json'
    a.click()
  }

  return (
    <div className="grid grow flex-shrink w-full grid-rows-5 overflow-hidden">
      <div className="grid grid-cols-2 w-full row-span-3 divide-x">
        <div className="flex flex-col p-4">
          <div className="flex flex-col">
            <label className="text-sm">Infura Key</label>
            <input
              type="text"
              className={getDefaultInputClasses('mt-1')}
              value={infuraKey}
              onChange={(e) => {
                setInfuraKey(e.target.value)
              }}
            />
          </div>
          <div className="flex flex-col mt-3">
            <label className="text-sm">Network</label>
            <select
              className={getDefaultInputClasses('mt-1 px-2')}
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
            >
              {infuraNetworks.map((network) => (
                <option key={network}>{network}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mt-3">
            <label className="text-sm">Contract Address</label>
            <input
              type="text"
              className={getDefaultInputClasses('mt-1')}
              value={contractAddress}
              onChange={(e) => {
                setContractAddress(e.target.value)
              }}
            />
          </div>
          <div className="flex mt-6 justify-end">
            <button
              className={getPrimayButtonClasses('text-sm px-3 py-1 h-9')}
              onClick={() => {
                downloadLogs(infuraKey, network, contractAddress)
              }}
            >
              Download
            </button>
          </div>
        </div>
        <div className="p-4 flex flex-col overflow-hidden">
          <h2 className="text-xl font-semibold">Logs</h2>
          <p className="mt-3 flex-1 bg-slate-100 whitespace-pre-line overflow-auto p-2">
            {logs.join('\n')}
          </p>
        </div>
      </div>
      <div className="row-span-2 border-t p-4">
        <h2 className="text-xl font-semibold">Data</h2>
        <div>
          <span>{data ? data.length : 0}</span>
          <button
            className={getPrimayButtonClasses('text-sm px-3 py-1 h-9')}
            onClick={downloadData}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default Downloader

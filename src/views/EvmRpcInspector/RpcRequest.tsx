'use client'

import useLocalStorage from '@/hooks/useLocalstorage'
import React, { FC, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { getPrimayButtonClasses } from '@/css/button'
import Select from '@/components/Select'
import { getDefaultInputClasses } from '@/css/input'

const ethMethods = [
  {
    value: 'eth_blockNumber',
    label: 'eth_blockNumber',
  },
  {
    value: 'eth_getBlockByNumber',
    label: 'eth_getBlockByNumber',
  },
  {
    value: 'eth_getBlockByHash',
    label: 'eth_getBlockByHash',
  },
  {
    value: 'eth_getTransactionByHash',
    label: 'eth_getTransactionByHash',
  },
  {
    value: 'eth_getTransactionReceipt',
    label: 'eth_getTransactionReceipt',
  },
  {
    value: 'eth_getLogs',
    label: 'eth_getLogs',
  },
]

interface Props {
  onRequest: (rpc: string, method: string, params: any[]) => void
}

const RpcRequest: FC<Props> = ({ onRequest }) => {
  const [rpcUrl, setRpcUrl] = useLocalStorage('evm-rpc-inspector.rpcUrl', '')
  const [method, setMethod] = React.useState(ethMethods[0].value)
  const [param, setParam] = React.useState<any>({})
  return (
    <div className="flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-3">Request</h2>
      <div className="flex flex-col">
        <label>Rpc Url</label>
        <input
          type="text"
          className={getDefaultInputClasses("mt-1")}
          onChange={(e) => {
            setRpcUrl(e.target.value)
          }}
        />
      </div>
      <div className="flex flex-col">
        <label>Method</label>
        <Select className='mt-1' value={method} options={ethMethods} onChange={setMethod} />
      </div>
      {method === 'eth_getLogs' && (
        <>
          <div className="flex flex-col">
            <label>FromBlock</label>
            <input
              type="text"
              className="border"
              onChange={(e) => {
                setParam((prev: any) => ({
                  ...prev,
                  fromBlock: e.target.value,
                }))
              }}
            />
          </div>
          <div className="flex flex-col">
            <label>To Block</label>
            <input
              type="text"
              className="border"
              onChange={(e) => {
                setParam((prev: any) => ({ ...prev, toBlock: e.target.value }))
              }}
            />
          </div>
          <div className="flex flex-col">
            <label>Address</label>
            <input
              type="text"
              className="border"
              onChange={(e) => {
                setParam((prev: any) => ({ ...prev, address: e.target.value }))
              }}
            />
          </div>
        </>
      )}

      <div className='flex mt-6'>
        <button
          className={getPrimayButtonClasses('')}
          onClick={() => {
            onRequest(rpcUrl, method, [param])
          }}
        >
          Request
        </button>
      </div>
    </div>
  )
}

export default RpcRequest

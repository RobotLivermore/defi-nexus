'use client'

import Button from '@/components/Button'
import React, { FC } from 'react'

interface Props {
  onRequest: (rpc: string, method: string, params: any[]) => void
}

const RpcRequest: FC<Props> = ({ onRequest }) => {
  const [rpcUrl, setRpcUrl] = React.useState('')
  const [method, setMethod] = React.useState('')
  const [param, setParam] = React.useState<any>({})
  return (
    <div className="flex flex-col p-4">
      <h2 className='text-xl font-semibold mb-3'>Request</h2>
      <div className="flex flex-col">
        <label>Rpc Url</label>
        <input
          type="text"
          className="border"
          onChange={(e) => {
            setRpcUrl(e.target.value)
          }}
        />
      </div>
      <div className="flex flex-col">
        <label>Method</label>
        <select
          value={method}
          onChange={(e) => {
            setMethod(e.target.value)
          }}
        >
          <option></option>
          <option>eth_blockNumber</option>
          <option>eth_getBlockByNumber</option>
          <option>eth_getBlockByHash</option>
          <option>eth_getTransactionByHash</option>
          <option>eth_getTransactionReceipt</option>
          <option>eth_getLogs</option>
        </select>
      </div>
      {method === 'eth_getLogs' && (
        <>
          <div className="flex flex-col">
            <label>FromBlock</label>
            <input
              type="text"
              className="border"
              onChange={(e) => {
                setParam((prev: any) => ({ ...prev, fromBlock: e.target.value }))
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

      <div>
        <Button
          theme="primary"
          className='px-4 mt-4'
          onClick={() => {
            onRequest(rpcUrl, method, [param])
          }}
        >
          Request
        </Button>
      </div>
    </div>
  )
}

export default RpcRequest

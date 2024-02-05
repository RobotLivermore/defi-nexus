'use client'

import React, { FC } from 'react'
import RpcRequest from './RpcRequest'
import RpcResponse from './RpcResponse'
import useCallRpc from './useCallRpc'

const EvmRpcInspectorView: FC = () => {
  const callRpc = useCallRpc()
  const [result, setResult] = React.useState<any>(null)

  const handleRequest = async (rpc: string, method: string, params: any[]) => {
    const response = await callRpc(rpc, method, params)
    console.log(response)
    setResult(response)
  }
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold w-full border-b px-4 py-3">Evm Rpc Inspector</h1>
      <div className="w-full grid grid-cols-2 divide-x grow">
        <RpcRequest onRequest={handleRequest} />
        <RpcResponse result={result} />
      </div>
    </div>
  )
}

export default EvmRpcInspectorView

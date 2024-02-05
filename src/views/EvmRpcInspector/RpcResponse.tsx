'use client'

import React, { FC } from 'react'

interface Props {
  result: any
}

const RpcResponse: FC<Props> = ({ result }) => {
  return (
    <div className="flex flex-col p-4">
      <h2 className='text-xl font-semibold mb-3'>Response</h2>
      <div className='overflow-auto bg-slate-100  p-2'>
        <pre className=''>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  )
}

export default RpcResponse

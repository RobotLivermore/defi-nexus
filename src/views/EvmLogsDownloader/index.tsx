'use client'

import React, { FC } from 'react'
import Downloader from './Downloader'

interface Props {}

const EvmLogsDownloader: FC<Props> = ({}) => {
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold w-full border-b px-4 py-3">
        Evm Logs Downloader
      </h1>
      <Downloader />
    </div>
  )
}

export default EvmLogsDownloader

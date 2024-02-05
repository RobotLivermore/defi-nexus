'use client'

import React, { FC, useState } from 'react'

const Downloader: FC = () => {
  const [infuraKey, setInfuraKey] = useState<string>('')

  return (
    <div className="grow w-full grid-rows-5">
      <div className="grid grid-cols-2 w-full row-span-3">
        <div className="flex flex-col">
          <label>Infura Key</label>
          <input
            type="text"
            className="border"
            value={infuraKey}
            onChange={(e) => {
              setInfuraKey(e.target.value)
            }}
          />
        </div>
        <div>logs</div>
      </div>
      <div className="row-span-2">123</div>
    </div>
  )
}

export default Downloader

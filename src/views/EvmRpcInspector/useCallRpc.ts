import { useCallback } from "react"

const useCallRpc = () => {
  const callRpc = useCallback(async (rpc: string, method: string, params: any[]) => {
    const response = await fetch(rpc, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params
      })
    })
    const json = await response.json()
    return json
  }, [])

  return callRpc
}

export default useCallRpc

//
// rpc is wss://polygon-mainnet.s.chainbase.online/v1/<your-api-key>
// 使用ethers监听block事件

// import ethers, {WebSocketProvider} from "ethers";

// const rpc = "wss://polygon-mainnet.s.chainbase.online/v1/<your-api-key>";
// const provider = new WebSocketProvider(rpc);

// provider.on("block", async (blockNumber, playload) => {
//     console.log("new block:", blockNumber, );
//     const block = await playload.emitter.getBlock()
//     console.log(block.hash);
// });

// 创建websocket链接
import WebSocket from 'ws'

const chainbaseKey = process.env.CHAINBASE_KEY

const socket = new WebSocket(`wss://polygon-mainnet.s.chainbase.online/v1/${chainbaseKey}`)

let lastestBlockNumber = 0
let lastestBlockHash = ''

// 监听消息
socket.onmessage = (event) => {
  // console.log('Message from server ', event.data)
  try {
    const data = JSON.parse(event.data as string)
    const blockNumber = parseInt(data.params.result.number, 16)
    const blockHash = data.params.result.hash
    if (blockNumber <= lastestBlockNumber) {
      console.log('reorg', blockNumber, blockHash, lastestBlockNumber, lastestBlockHash)
    }
    lastestBlockNumber = blockNumber
    lastestBlockHash = blockHash
  } catch (error) {
    console.log(event.data)
  }
}

socket.onopen = (event) => {
  console.log('Connected to server', event)
  socket.send(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_subscribe',
      params: ['newHeads'],
    })
  )
}



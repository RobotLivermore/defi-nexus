import fs from 'fs'

const apiKey = process.env.CHAINBASE_KEY as string;
const queryId = "69";


const headers = {
  "X-API-KEY": apiKey,
  "Content-Type": "application/json",
};

async function executeQuery(queryId: string, startFrom: number) {
  const data = {
    queryParameters: {
     address: "0xc8ee91a54287db53897056e12d9819156d3822fb",
     start_from: String(startFrom)
    },
  };
  return await fetch(
    `https://api.chainbase.com/api/v1/query/${queryId}/execute`,
    { method: "POST", headers, body: JSON.stringify(data) }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      return data.data[0].executionId
    });
}

async function checkStatus(executionId: string) {
  return await fetch(
    `https://api.chainbase.com/api/v1/execution/${executionId}/status`,
    { headers }
  )
    .then((response) => response.json())
    .then((data) => data.data[0]);
}

async function getResults(executionId: string) {
  return await fetch(
    `https://api.chainbase.com/api/v1/execution/${executionId}/results`,
    { headers }
  ).then((response) => response.json());
}

async function fetchBlockList(startFrom: number = 0) {
  const executionId = await executeQuery(queryId,startFrom);
  let status;
  do {
    const statusResponse = await checkStatus(executionId);
    status = statusResponse.status;
    const progress = statusResponse.progress;
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log(`${status} ${progress} %`);
  } while (status !== "FINISHED" && status !== "FAILED");

  const results = await getResults(executionId);
  return results.data.data;
}

async function main() {
  let startFrom = 0;
  const results: any = [];
  while (true) {
    const list = await fetchBlockList(startFrom);
    results.push(...list);
    startFrom = list[list.length - 1][0];
    if (new Date(list[list.length - 1][1]).valueOf() > Date.now() - 1000 * 60 * 60 * 24) {
      break;
    }
  } 
  fs.writeFileSync('./data/analysis/blockTimestamp.json', JSON.stringify(results, null, 2));
  
}

main();
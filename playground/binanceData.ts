import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'
import fs from 'fs'
import jszip from 'jszip'

const fetchTradesList = async (tradePair: string, marker?: string) => {
  const url = new URL(
    'https://s3-ap-northeast-1.amazonaws.com/data.binance.vision'
  )
  url.searchParams.append('delimiter', '/')
  url.searchParams.append(
    'prefix',
    `data/futures/um/daily/trades/${tradePair}/`
  )
  if (marker) {
    url.searchParams.append('marker', marker)
  }
  console.log(marker, url.toString())
  const resp = await fetch(url)
  const result = await resp.text()
  return result
}

const fetchAllTradeData = async (tradePair: string) => {
  const list: string[] = []
  let nextMarker = ''
  while (true) {
    const result = await fetchTradesList(tradePair, nextMarker)
    const parser = new XMLParser()
    let jObj = parser.parse(result)
    const contents = jObj['ListBucketResult']['Contents']
    nextMarker = jObj['ListBucketResult']['NextMarker']
    if (contents) {
      list.push(...contents)
    }
    if (!nextMarker) {
      break
    }
  }
  return list
}

const fetchAndSaveTradeDataList = async (tradePair: string) => {
  const list = await fetchAllTradeData(tradePair)
  console.log(list)
  fs.writeFileSync(
    `./data/analysis/trades_${tradePair}.json`,
    JSON.stringify(list, null, 2)
  )
}

const downloadData = async (tradePair: string, key: string) => {
  const url = `https://data.binance.vision/${key}`
  try {
    const resp = await fetch(url)
    const buffer = await resp.arrayBuffer()
    const zip = await jszip.loadAsync(buffer)
    Object.keys(zip.files).forEach(function (filename) {
      console.log(filename)
      // 如果你需要解压特定文件，可以在这里添加更多逻辑
      // 例如，使用zip.file(filename).async('nodebuffer').then(...)来解压和处理文件
      zip
        .file(filename)
        ?.async('nodebuffer')
        .then((data) => {
          fs.writeFileSync(
            `./data/trades/${tradePair}/${filename}`,
            Buffer.from(data)
          )
        })
    })
  } catch (e) {}

  // fs.writeFileSync(`./data/analysis/ETHUSDT-trades-2023-09-16.zip`, Buffer.from(buffer))
}

const main = async () => {
  const rawFile = fs.readFileSync(
    './data/analysis/trades_ETHUSDT.json',
    'utf-8'
  )
  const files = fs.readdirSync('./data/trades/ETHUSDT')
  const list = JSON.parse(rawFile)
  for (const key of list) {
    if (
      key.Key.split('.').pop() === 'zip' &&
      !files.includes(key.Key.split('/').pop().split('.')[0] + '.csv')
    ) {
      console.log(key.Key)
      await downloadData('ETHUSDT', key.Key)
    }
  }
}

main()

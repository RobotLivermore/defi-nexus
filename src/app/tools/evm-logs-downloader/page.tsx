import { Metadata } from 'next'

import EvmLogsDownloader from '@/views/EvmLogsDownloader'
import generateMetadata from '@/components/metadata/generateMetadata'

import meta from './meta.json'


export const metadata: Metadata = generateMetadata(meta)

function Page() {
  return <EvmLogsDownloader />
}

export default Page

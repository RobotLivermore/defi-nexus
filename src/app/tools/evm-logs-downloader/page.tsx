import { Metadata } from 'next'

import meta from './meta.json'
import EvmLogsDownloader from '@/views/EvmLogsDownloader'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.defi-nenux.xyz'),
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'website',
    url: meta.url,
    images: [{ url: meta.image, alt: meta.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    site: meta.url,
    images: meta.image,
  },
}

function Page() {
  return <EvmLogsDownloader />
}

export default Page

import { Metadata } from 'next'
import meta from './meta.json'

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
  },
}

function Page() {
  return (
    <div>
      <h1>Tools</h1>
    </div>
  )
}

export default Page

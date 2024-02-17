import { Metadata } from 'next'

const generateMetadata = (meta: {
  title: string
  description: string
  image: string
  url: string
}) => {
  return {
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
  } as Metadata
}

export default generateMetadata

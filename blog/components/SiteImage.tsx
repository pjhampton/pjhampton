import Image, { ImageLoader } from "next/image"

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
  if (!quality) {
    quality = 75
  }
  return `https://blog-image-renderer.pdvil.workers.dev?width=${width}&quality=${quality}&image=https://pjhampton.com/${src}`;
}

export default function SiteImage(props: any) {
  if (process.env.NODE_ENV === 'development') {
    return <Image unoptimized={true} {...props} />
  } else {
    return <Image {...props} loader={cloudflareImageLoader} />
  }
}

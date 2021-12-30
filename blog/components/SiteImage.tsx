import Image, { ImageLoader } from "next/image"
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig()

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
  if (!quality) {
    quality = 75
  }
  return `https://blog-image-renderer.pdvil.workers.dev?width=${width}&quality=${quality}&image=https://pjhampton.com/${src}`;
}

const SiteImage = (props: any) => {
  if (process.env.NODE_ENV === 'development') {
    return <Image {...props} unoptimized={true} />
  } else {
    return <Image {...props} loader={cloudflareImageLoader} />
  }
}

export default SiteImage

import Image, { ImageLoader } from "next/image"
import getConfig from "next/config";

const { cloudflareConfig } = getConfig()

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
  if (!quality) {
    quality = 75
  }
  return `${cloudflareConfig.imageWorkerURL}?width=${width}&quality=${quality}&image=https://pjhampton.com/${src}`;
}

const SiteImage = (props: any) => {
  if (process.env.NODE_ENV === 'development') {
    return <Image {...props} unoptimized={true} />
  } else {
    return <Image {...props} loader={cloudflareImageLoader} />
  }
}

export default SiteImage

import Image, { ImageLoader } from "next/image"

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
  if (!quality) {
    quality = 75
  }
  return `https://blog-image-renderer.pdvil.workers.dev?width=${width}&quality=${quality}&image=https://pjhampton.com/${src}`;
}

const SiteImage = (props: any) => {
  if (process.env.NODE_ENV === 'development') {
    return <Image {...props} placeholder={'blur'} unoptimized={true} alt="" />
  } else {
    return <Image {...props} placeholder={'blur'} loader={cloudflareImageLoader} alt="" />
  }
}

export default SiteImage

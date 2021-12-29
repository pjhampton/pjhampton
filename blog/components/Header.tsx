import Link from 'next/link'
import Image, { ImageLoader } from 'next/image'

import avatar from '../public/pjhampton-avatar.png'

const normalizeSrc = (src: string) => {
  return src[0] === "/" ? src.slice(1) : src;
};

const cloudflareLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}

const headerStyle = {
  marginBottom: '1em'
}

export default function Header() {
  return (
    <header className="header text-center" style={headerStyle}>
      <div className="avatarContainer">
        <Image 
          alt="PJ Hampton"
          className="avatar"
          loader={cloudflareLoader}
          src={avatar} />
      </div>
      <nav className="navbar navbar-expand-md navbar-light">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item active text-center">
            <Link href="/">
              <button className="btn btn-outline-primary me-3 text-uppercase" type="button">
                Home
              </button>
            </Link>
          </li>
          <li className="nav-item text-center">
            <Link href="/talks">
              <button className="btn btn-outline-primary me-3 text-uppercase" type="button">
                Talks
              </button>
            </Link>
          </li>
          <li className="nav-item text-center">
            <Link href="/about">
              <button className="btn btn-outline-primary me-3 text-uppercase" type="button">
                About Me
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

import Link from 'next/link'
import SiteImage from '../components/SiteImage'
import avatar from '../public/pjhampton-avatar.png'

const headerStyle = {
  marginBottom: '1em'
}

export default function Header() {
  return (
    <header className="header text-center" style={headerStyle}>
      <div className="avatarContainer">
        <Link href="/">
          <a>
            <SiteImage 
              alt="PJ Hampton"
              className="avatar"
              src={avatar} />
          </a>
        </Link>
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

import Link from 'next/link'
import NavLink from './NavLink'
import SiteImage from '../components/SiteImage'
import avatar from '../public/pjhampton-avatar.png'

export default function Header() {

  return (
    <header className="header text-center" style={{marginBottom: '1em'}}>
      <div className="avatarContainer">
        <Link href="/">
          <a>
            <SiteImage 
              alt="PJ Hampton"
              className="avatar"
              height={150}
              width={150}
              placeholder="blur"
              src={avatar} />
          </a>
        </Link>
      </div>
      <nav className="navbar navbar-expand-md navbar-light">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item active text-center">
            <NavLink text="Home" href="/" />
          </li>
          <li className="nav-item text-center">
            <NavLink text="Talks" href="/talks" />
          </li>
          <li className="nav-item text-center">
            <NavLink text="About" href="/about" />
          </li>
        </ul>
      </nav>
    </header>
  )
}

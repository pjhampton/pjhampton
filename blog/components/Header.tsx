import Link from 'next/link'
import NavLink from './NavLink'
import SiteImage from '../components/SiteImage'
import avatar from '../public/pjhampton-avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faKeybase, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

export default function Header() {

  return (
    <header className="header text-center" style={{marginBottom: '1em'}}>
      
      <div className="avatarContainer">
        <Link href="/">
          <a>
            <SiteImage 
              alt="PJ Hampton Avatar"
              className="avatar"
              src={avatar} />
          </a>
        </Link>
      </div>
      <div>
        <ul className="social">
          <li>
            <Link href={"https://github.com/pjhampton"}>
              <a target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
            </Link>
          </li>
          <li>
            <Link href={"https://keybase.io/pjhampton"}>
              <a target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faKeybase} size="2x" />
              </a>
            </Link>
          </li>
          <li>
            <Link href={"https://www.linkedin.com/in/pjhampton/"}>
              <a target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} size="2x" />
              </a>
            </Link>
          </li>
        </ul>
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

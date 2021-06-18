import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header className="header text-center">
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
              <Link href="/projects">
                <button className="btn btn-outline-primary me-3 text-uppercase" type="button">
                  Projects
                </button>
              </Link>
            </li>
            <li className="nav-item text-center">
              <Link href="/about">
                <button className="btn btn-outline-primary me-3 text-uppercase" type="button">
                  About
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
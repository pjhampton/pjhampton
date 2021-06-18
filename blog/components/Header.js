import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header className="header text-center">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item active text-center">
              <Link href="/">
                <button className="btn btn-outline-success me-2" type="button">
                  <a>Home</a>
                </button>
              </Link>
            </li>
            <li className="nav-item text-center">
              <Link href="/projects">
                <button className="btn btn-outline-success me-2" type="button">
                  <a>Projects</a>
                </button>
              </Link>
            </li>
            <li className="nav-item text-center">
              <Link href="/about">
                <button className="btn btn-outline-success me-2" type="button">
                  <a>About</a>
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
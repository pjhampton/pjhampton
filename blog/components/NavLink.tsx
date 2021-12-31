import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavLinkProps {
  text: string;
  href: string;
}

const NavLink = ({text, href} : NavLinkProps) => {
  const router = useRouter()
  const baseNavStyles = ["btn", "me-3", "text-uppercase"]

  return (
    <>
      <Link href={href}>
        <button className={
          router.pathname == `${href}` ? 
            ["btn-primary", ...baseNavStyles].join(" ").toString() 
            : ["btn-outline-primary", ...baseNavStyles].join(" ").toString()
          } type="button">
          {text}
        </button>
      </Link>
    </>
  )
}

export default NavLink

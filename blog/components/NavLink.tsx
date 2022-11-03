import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavLinkProps {
  text: string;
  href: string;
  otherHrefMatches: string[];
}

const NavLink = ({text, href, otherHrefMatches} : NavLinkProps) => {
  const router = useRouter()
  const baseStyles = [
    'block', 
    'w-full', 
    'px-6', 
    'py-3', 
    'my-2', 
    'text-lg', 
    'font-medium', 
    'uppercase', 
    'border-b-4', 
    'nav-link'
  ]

  const routerPathStartWith = (pathname: string): boolean => {
    if (pathname === href) {
      return true
    }

    for (const otherHref of otherHrefMatches) {
      if (pathname.startsWith(otherHref)) {
        return true
      }
    }

    return false
  }

  return (
    <Link href={href} legacyBehavior>
      <button className={
        routerPathStartWith(router.pathname) ?
          ['activeNavLink', ...baseStyles].join(' ').toString()
          : baseStyles.join(' ').toString()
        } type='button'>
        {text}
      </button>
    </Link>
  );
}

export default NavLink

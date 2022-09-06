import Link from "next/link"
import avatar from '@public/avatar.png'
import SiteImage from "@components/SiteImage"

const FourOhFour = () => {
  return (
    <>
      <div className="errorpage">
        <figure className='p-8 text-center bg-white rounded-xl md:p-0 dark:bg-slate-800 w-80 h-96' style={{position: 'fixed'}}>

          <div className='p-2 pt-6'>
            <Link href="/">
              <a className='pt-10'>
                <SiteImage className='w-24 h-24 mx-auto rounded-full' src={avatar} alt='PJ Hampton Avatar' width='150' height='150' />
              </a>
            </Link>
          </div>

          <div className='p-6 pt-6 space-y-4 text-center'>
            <figcaption className='text-4xl font-bold'>
              404
            </figcaption>

            <Link href="/">
              <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                Take Me Home
              </button>
            </Link>
          </div>

        </figure>
      </div>
    </>
  )
}

export default FourOhFour

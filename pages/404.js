import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SEO from '../components/SEO'
import oops from '../public/assets/oops.webp'

const PageNotFound = () => {
  return (
    <>
        <SEO />
        <div className="flex items-center flex-col justify-center h-screen">
            <Image src={oops} priority="high" height={165} width={500} alt="File not found"/>
            <h3 className="text-2xl font-bold">404 - PAGE NOT FOUND</h3>
            <h5 className="text-gray-500 max-w-[550px] text-center ">The page you are looking for might have been removed, had it name changed or is temporarily available.</h5>
            <Link href="/" passHref>
                <a>
                    <button className="gradBlue p-3 rounded-full text-white px-6 mt-4">Go to Homepage</button>
                </a>
            </Link>
        </div>
    </>
  )
}

export default PageNotFound
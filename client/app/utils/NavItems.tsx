import Link from 'next/link';
import React from 'react'

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

type Props = {
    activeItem: number;
    isMobile: boolean;
}

const NavItems:React.FC<Props> = ({activeItem, isMobile}) => {
  return (
  <>
<div className='hidden custom-md:flex'>
  {navItemsData.map((i, index) => (
    <Link href={i.url} key={index} passHref>
      <span
        className={`${
          activeItem === index
            ? "text-primary"
            : "text-foreground hover:text-primary"
        } px-6 font-poppins font-[400] text-[18px] transition-colors cursor-pointer`}
      >
        {i.name}
      </span>
    </Link>
  ))}
</div>

{isMobile && (
  <div className='custom-md:hidden mt-5'>
    <div className='w-full flex flex-col py-6' >
      {navItemsData.map((i, index) => (
        <Link href={i.url} key={index} passHref>
          <span
            className={`${
              activeItem === index
                ? "text-primary"
                : "text-foreground hover:text-primary"
            } px-6 font-poppins font-[400] text-[18px] transition-colors cursor-pointer`}
          >
            {i.name}
          </span>
        </Link> 
      ))}
    </div>
  </div>
)}

  </>
  )
}

export default NavItems
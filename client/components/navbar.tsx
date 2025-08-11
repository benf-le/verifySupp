import Link from "next/link";

export const Navbar = () => {
    return (<nav className='sticky top-0 z-50 bg-green-600 shadow'>
        <div className='container mx-auto flex items-center justify-between p-12'>
            <Link href='/' className='hover:text-white font-bold'>
                Logo
            </Link>
             <div className='hidden md:flex space-x-6'>
                 <Link href={'/checkout'} className='hover:text-white font-bold'>
                     Checkout</Link>

             </div>


        </div>

    </nav>)
}
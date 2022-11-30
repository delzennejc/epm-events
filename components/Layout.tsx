import { ReactElement, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreRehydrated } from 'easy-peasy'
import { useAppActions } from "../store";
import Link from "next/link";

interface LayoutType {
    children: ReactNode;
    className?: string;
}

const Layout = ({ children, className = '' }: LayoutType) => {
    const router = useRouter()
    const isEventPage = router.pathname.includes('event')
    const eventLayoutStyle = isEventPage ? 'h-24' : 'h-52'

    return (<>
        <div className={`relative z-10 flex flex-col items-center justify-center w-full h-full pb-14`}>
            <div className={`luminous relative w-full ${eventLayoutStyle} flex justify-between mb-20 md:mb-5 px-6 md:px-16`}>
                <img 
                    className="cursor-pointer" 
                    style={{ width: '263px', height: '73px' }} 
                    src="/logo.svg" 
                    alt="logo"
                    onClick={() => router.push('/')}
                />
            </div>
            <div className={`w-full h-full flex flex-col items-center ${className}`}>
                {children}
            </div>
        </div>
    </>)
}

export default Layout;
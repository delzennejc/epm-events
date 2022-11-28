import { ReactNode, useEffect } from "react";
import { useAppActions, useAppState } from "../store";
import { formatDistanceDate } from "../utils/utils";
import FadeIn from 'react-fade-in';

interface AppListType {
    children: ReactNode;
    date: string;
}

const AppList = ({ children, date }: AppListType) => {
    const isMobile: boolean = useAppState((state) => state.data.ui.isMobile)
    const currDate = formatDistanceDate(date)
    return (
        <div 
            style={{ width: isMobile ? "100%" : "800px" }} 
            className="relative flex flex-col max-w-full w-5/6 dark-purple px-6 py-5 pb-8 rounded-tr-xl rounded-br-xl rounded-bl-xl"
        >
            <div className="absolute -top-11 left-0 px-6 py-2.5 flex space-x-2 dark-purple items-center rounded-tl-xl rounded-tr-xl">
                <img className="w-7" src="/today-icon.png" alt="Date Icon" />
                <p className="urbanist text-xl text-white font-extrabold">{currDate}</p>
                <img className="today-corner" src="/bottom-right.svg" alt="corner" />
            </div>
            <FadeIn className="space-y-5 max-w-full">
                {children}
            </FadeIn>
        </div>
    )
}

export default AppList;
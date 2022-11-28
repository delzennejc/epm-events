import { useEffect } from "react";
import _ from 'lodash'
import LazyLoad from 'react-lazyload';
import { useAppActions, useAppState } from "../store";
import Tags from "./Tags";
import UpvoteButton from "./UpvoteButton";
import { useRouter } from "next/router";
import Image from "./Image";

interface AppItemType {
    id: string;
    rank: number;
    name: string;
    logoUrl: string;
    description: string;
    tags: string[];
    upvotes: number;
    blockchains: string[];
    upvoted?: boolean;
    published_at: Date;
    link: string;
    onClick?: () => void
}

const AppItem = ({ rank, name, id, logoUrl, description, tags, upvotes, blockchains, published_at, link, upvoted = false, onClick }: AppItemType) => {
    const router = useRouter()
    const isMobile: boolean = useAppState((state) => state.data.ui.isMobile)

    const rankColor = rank === 0 ? 'gold' : rank === 1 ? 'silver' : rank === 2 ? 'bronze' : ''
    const blockName = blockchains.length > 1 ? 'Multi' : blockchains[0]
    const logoSize = isMobile ? '50px' : '80px'
    const onAppClick = () => {
        router.push(`?productId=${id}`, `/product/${id}`, { shallow: true })
    }
    const onLinkClick = (e: any) => {
        e.stopPropagation()
    }
    return (<div onClick={onAppClick} className="group relative w-full flex flex-col md:flex-row py-4 px-5 light-purple rounded-xl cursor-pointer">
        <div 
            style={{ width: logoSize, height: logoSize }} 
            className="rounded-full overflow-hidden flex-shrink-0 mb-3 md:mb-0"
        >
            <Image src={logoUrl} alt="App Logo" type="logo" />
        </div>
        <div className="flex flex-col justify-between md:ml-4">
            <div className="">
                <p className="urbanist font-bold text-white text-lg md:text-md">
                    {name} 
                    {rankColor && <span className={`inline-block ${rankColor} text-md ml-2.5`}>
                        <span className="font-normal text-xs">#</span>{rank + 1}
                    </span>}
                    <a href={`${link}?ref=builda.dev`} target="_blank" onClick={onLinkClick} rel="noreferrer">
                        <img 
                            className="inline opacity-100 md:opacity-0 transition-opacity ml-2 h-5 group-hover:opacity-100 ease-in-out duration-200" 
                            src="/app-link.svg" 
                            alt="link"
                        />
                    </a>
                </p>
                <p className="text-sm md:font-normal light-text-purple mb-3">
                    {_.truncate(description, { length: 68})}
                </p>
            </div>
            <Tags tags={tags} />
        </div>
        <div className="absolute md:relative right-4 md:right-0 space-y-2 md:space-y-auto flex flex-col justify-between ml-auto items-end">
            <UpvoteButton 
                id={id} 
                published_at={published_at} 
                upvotes={upvotes} 
                upvoted={upvoted}
            />
            <p className="text-xs font-medium ml-auto">{blockName}</p>
        </div>
    </div>)
}

export default AppItem;
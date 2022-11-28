import { format } from "date-fns";

import { useCallback, useEffect, useState } from "react";
import _ from 'lodash'
import ImageViewer from "react-simple-image-viewer";
import LazyLoad from 'react-lazyload';
import { useAppActions, useAppState } from "../store";
import { AppsListType, AppsType } from "../store/store.model";
import { formatDistanceDate } from "../utils/utils";
import Tags from "./Tags";
import UpvoteButton from "./UpvoteButton";
import VisitButton from "./VisitButton";
import Image from "./Image";

interface AppsDetailsType {
    shadow?: boolean;
}

const AppsDetails = ({ shadow = false }: AppsDetailsType) => {
    const selectedApp: AppsType = useAppState((state) => state.data.selectedApp)
    const isMobile: boolean = useAppState((state) => state.data.ui.isMobile)
    const apps: AppsListType = useAppState((state) => state.data.apps)
    const changeViewerOpen = useAppActions(actions => actions.changeViewerOpen)

    const currDate = selectedApp && formatDistanceDate(selectedApp?.published_at)
    const key = selectedApp && format(new Date(selectedApp?.published_at), 'LL/d/yyyy')
    const rank = selectedApp &&  _.reverse(_.sortBy(apps[key], 'upvotes')).findIndex((val) => selectedApp.id === val.id)
    const rankColor = rank === 0 ? 'gold' : rank === 1 ? 'silver' : rank === 2 ? 'bronze' : ''
    const shadowStyle = shadow ? 'tag-shadow' : ''

    const openImageViewer = useCallback((index) => {
        changeViewerOpen({ isViewerOpen: true, index })
      }, []);


    return (selectedApp && <div className="relative px-2 py-3 md:px-9">
        <div className="flex flex-col md:flex-row mb-6">
                <div 
                    style={{ width: '80px', height: '80px' }} 
                    className="rounded-full overflow-hidden mr-5 mb-4 md:mb-0"
                >
                <Image className={`${shadowStyle}`} src={selectedApp.logo} alt="Logo" type="logo" />
            </div>
            <div className="flex flex-col justify-between space-y-2 md:space-y-0">
                <p className="urbanist text-3xl md:text-2xl font-bold text-white mt-1">{selectedApp?.name}</p>
                <p  className="">{selectedApp?.short_description}</p>
                <p className="text-xs space-x-1">
                    <span className="mr-2">{currDate}</span>
                    <span className="font-bold">
                        {selectedApp?.blockchains.join(', ')}
                    </span>
                </p>
            </div>
            <p className={`urbanist absolute md:relative top-5 md:top-0 right-0 text-5xl md:text-4xl font-black ml-auto mr-2 ${rankColor}`}>
                {rank < 3 
                    ? <><span className="font-normal text-2xl md:text-xl">#</span>{rank + 1}</>
                    : ''
                }
            </p>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between mb-4">
           <Tags tags={selectedApp.tags} details={true} shadow={shadow} />
           <div className="flex space-x-2 mb-5 md:mb-0">
                <VisitButton link={selectedApp.link} />
                <UpvoteButton 
                    id={selectedApp.id} 
                    published_at={selectedApp.published_at} 
                    upvotes={selectedApp.upvotes} 
                    upvoted={false} details={true}
                />
           </div>
        </div>
        <div className="grid-container mb-4">
            {!isMobile && <>
                <div className="details-image-1 max-w-full rounded-xl overflow-hidden">
                    <Image type="image" onClick={() => openImageViewer(0)} src={selectedApp.images[0]} alt="Primary Image" />
                </div>
                <div className="details-image-2 rounded-xl overflow-hidden">
                    <Image type="image" onClick={() => openImageViewer(1)} src={selectedApp.images[1]} alt="Second Image" />
                </div>
                <div className="details-image-3 rounded-xl overflow-hidden">
                    <Image type="image" onClick={() => openImageViewer(2)} src={selectedApp.images[2]} alt="Third Image" />
                </div>
            </>}
            {isMobile && <>
                <div className="details-image-1 max-w-full rounded-xl overflow-hidden">
                    <Image type="image" onClick={() => openImageViewer(0)} src={selectedApp.images[0]} alt="Primary Image" />
                </div>
                <div className="flex space-x-3">
                    <div className="details-image-2 rounded-xl overflow-hidden">
                        <Image type="image" onClick={() => openImageViewer(1)} src={selectedApp.images[1]} alt="Second Image" />
                    </div>
                    <div className="details-image-3 rounded-xl overflow-hidden">
                        <Image type="image" onClick={() => openImageViewer(2)} src={selectedApp.images[2]} alt="Third Image" />
                    </div>
                </div>
            </>}
        </div>
        <p className="text-sm">
            {selectedApp.description}
        </p>
    </div>)
}

export default AppsDetails;
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useAppActions, useAppState } from "../store";

interface UpvoteButtonType {
    id: string;
    upvotes: number;
    upvoted: boolean;
    details?: boolean;
    published_at: Date;
}

const UpvoteButton = ({ id, published_at, upvotes, details = false }: UpvoteButtonType) => {
    const userUpvotes: string[] = useAppState((state) => state.data.user.upvotes)
    const updateUpvotes = useAppActions(actions => actions.updateUpvotes)
    const isUpvoted = userUpvotes.includes(id) 

    const upvoteIcon = isUpvoted ? details ? '/details-upvoted-icon.svg' : '/upvoted-icon.svg' : '/upvote-icon.svg'
    const upvoteIconStyle = isUpvoted ? details ? 'h-3' : '' : ''
    const upvoteBg = isUpvoted ? details ? 'bg-white' : 'light-purple-2' : details ? 'linear-orange' : 'light-purple-4'
    const upvoteColor = isUpvoted ? 'dark-text-purple' : ''
    const upvoteDetails = details ? 'font-medium px-4 pr-5 py-2 flex-shrink-0' : 'px-4 md:px-2.5 py-1.5'

    const key = format(new Date(published_at), 'LL/d/yyyy')

    return (
        <div 
            className={`urbanist flex flex-row items-center justify-center text-white ${upvoteBg} ${upvoteColor} ${upvoteDetails} rounded-lg cursor-pointer`}
            onClick={(e) => {
                if (!details) {
                    e.stopPropagation()
                }
                updateUpvotes({ id, upvotes, key })
                return
            }} 
        >
            <img className={`${upvoteIconStyle}`} src={upvoteIcon} alt="upvote" />
            <p className={`mt-0.5 md:mt-0 ml-1.5 flex-shrink-0 ${details && isUpvoted ? 'dark-text-orange' : upvoteColor}`}>{upvotes}{details ? ' Upvotes' : ''}</p>
        </div>
    )
}

export default UpvoteButton;
import { useEffect } from "react";
import { useAppActions } from "../store";

interface TagsType {
    tags: string[];
    details?: boolean;
    shadow?: boolean;
}

const Tags = ({ tags, details = false, shadow = false }: TagsType) => {
    const shadowStyle = shadow ? 'tag-shadow' : ''
    return (<ul className={`flex space-x-1.5 ${shadowStyle}`}>
    {tags.map((tag) => (
        <li key={tag} className={`light-purple-3 px-3 py-1 text-white text-xs rounded-full ${details ? 'mt-auto mb-auto' : ''}`}>
            {tag}
        </li>
    ))}
</ul>)
}

export default Tags;
import { useEffect, useState } from "react";
import CSS from 'csstype';
import _ from 'lodash';
import Placeholder from "./Placeholder";

interface ImagePropsType {
    src: string;
    className?: string;
    alt?: string;
    style?: CSS.Properties,
    onClick?: () => any,
    type: 'logo' | 'image' | 'app';
}

const Image = (props: ImagePropsType) => {
    const [isLoaded, setImageLoaded] = useState(false)
    const imgProps = _.omit(props, ['type'])
    const type = props.type
    return (<>
        {!isLoaded && <Placeholder type={type} />}
        <img
            {...imgProps}
            className={`${props.className} ${!isLoaded ? 'hidden' : ''}`} 
            // onLoad={() => setTimeout(() => setImageLoaded(true), 2000)}
            onLoad={() => setImageLoaded(true)}
        />
    </>)
}

export default Image;
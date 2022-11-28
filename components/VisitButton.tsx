import { useEffect } from "react";
import { useAppActions } from "../store";

interface VisitButtonType {
    link: string;
}

const VisitButton = ({ link }: VisitButtonType) => {
    const visitIcon = '/visit-icon.svg'
    const visitBg = 'dark-purple'
    const visitDetails = 'font-medium px-4 py-2'
    return (
        <a href={`${link}?ref=builda.dev`} target="_blank" rel="noreferrer" className={`urbanist flex text-white ${visitBg} ${visitDetails} rounded-lg cursor-pointer`}>
            <img className="" src={visitIcon} alt="visit" />
            <span className="ml-1.5 mt-auto">Visit</span>
        </a>
    )
}

export default VisitButton;
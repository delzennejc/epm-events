import Link from "next/link";
import { useEffect } from "react";
import { fr } from 'date-fns/locale'
import { addDays, subDays, format } from 'date-fns';
import { useAppActions } from "../store";

interface EventCardType {
    split?: boolean;
    image: string;
    title: string;
    time: Date;
    address: string;
    station: string;
    link: string;
}

const EventCard = ({ image, title, time, address, station, link, split = false }: EventCardType) => {
    const imageStyle = split ? 'w-full h-40 rounded-lg' : 'w-full h-60 rounded-3xl'
    const rounded = split ? 'rounded-lg' : 'rounded-3xl'
    const layoutStyle = split ? 'px-3 py-3' : 'px-5 py-5'
    const titleSize = split ? 'w-11/12 text-2xl' : 'w-4/6 text-4xl'
    const textStyle = split ? 'space-x-3 font-semibold text-md' : 'space-x-3 font-semibold text-lg'
    const textStyle2 = split ? 'space-x-3.5 font-semibold text-md' : 'space-x-3 font-semibold text-lg'
    const buttonStyle = split ? 'w-full text-center mt-5 mr-2' : 'ml-auto'
    return (<div className={`card-drop-shadow w-full flex flex-col items-center ${layoutStyle} bg-white rounded-2xl cursor-pointer`}>
        <div className="relative w-full flex flex-col">
            <div className={`relative w-full z-10 ${rounded} overflow-hidden`}>
                <div 
                    className={`${imageStyle} z-10`}
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                    }}
                >
                </div>
                <div 
                    className={`absolute filter-difference opacity-25 top-0 ${imageStyle} z-20`}
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                    }}
                >
                </div>
            </div>
            <div className="image-shadow self-center z-0"></div>
            <p className={`title-shadow absolute z-30 bottom-5 left-5 ${titleSize} text-white font-black leading-snug`}>
               {title}
            </p>
        </div>
        <div className={`w-full flex ${split ? 'flex-col mb-4' : 'mb-5'} self-start mt-6 ml-5 pr-5`}>
            <div className={`flex flex-col space-y-3`}>
                <p className={`flex items-center ${textStyle}`}>
                    <img src="/icon-time.svg" alt="date" />
                    <span>{format(new Date(time), "EEE dd MMMM yyyy, H'h'mm", { locale: fr })}</span>
                </p>
                <p  className={`flex items-center ${textStyle2}`}>
                    <img className="ml-0.5" src="/icon-location.svg" alt="addresse" />
                    <span>{address}</span>
                </p>
                <p className={`flex items-center ${textStyle}`}>
                    <img src="/icon-station.svg" alt="métro" />
                    <span>{station}</span>
                </p>
            </div>
            <Link href="/">
                <p className={`urbanist ${buttonStyle} linear-main-color rounded-md self-end text-white font-black py-2 px-6 cursor-pointer`}>
                    PLUS D'INFOS
                </p>
            </Link>
        </div>
    </div>)
}

export default EventCard;
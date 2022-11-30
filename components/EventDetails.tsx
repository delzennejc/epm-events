import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppActions, useAppState } from "../store";
import { fr } from 'date-fns/locale'
import { addDays, subDays, format } from 'date-fns';
import { EventType } from "../store/store.model";
import LocationMap from "./LocationMap";

interface EventDetailsType {}

const EventDetails = ({}: EventDetailsType) => {
    const router = useRouter()
    const selectedEvent: EventType = useAppState(state => state.data.selectedEvent)
    if (!selectedEvent) {
        return null
    }
    return (<div className="flex flex-col items-center space-y-8">
        <div className="relative w-full flex flex-col">
            <div className={`relative w-full z-10 rounded-3xl overflow-hidden`}>
                <div 
                    className={`w-full h-72 rounded-3xl z-10`}
                    style={{
                        backgroundImage: `url(${selectedEvent.image})`,
                        backgroundSize: "cover",
                    }}
                >
                </div>
                <div 
                    className={`absolute filter-difference opacity-25 top-0 w-full h-72 rounded-3xl z-20`}
                    style={{
                        backgroundImage: `url(${selectedEvent.image})`,
                        backgroundSize: "cover",
                    }}
                >
                </div>
            </div>
            <div className="image-shadow self-center z-0"></div>
            <div onClick={() => router.back()} className="absolute z-30 top-4 left-32 flex items-center justify-center w-10 h-10 bg-gray-800 bg-opacity-30 rounded-full pt-1 pr-1 cursor-pointer">
                <img className="h-7" src="/icon-back-button.svg" alt="back-button" />
            </div>
            <p className={`title-shadow absolute z-30 bottom-8 left-32 w-4/6 text-4xl text-white font-black leading-snug`}>
               {selectedEvent.title.toUpperCase()}
            </p>
        </div>
        <div className="flex w-10/12 space-x-10">
            <div className="flex flex-col w-4/6 space-y-5">
                <div className="flex flex-col space-y-2">
                    <p className="text-title-orange font-extrabold text-lg">Description</p>
                    <p className="text-gray-600 leading-snug pr-6">{selectedEvent.description}</p>
                </div>
                <div className="inline-flex flex-col space-y-3">
                    <p className="text-title-orange font-extrabold text-lg">Localisation</p>
                    <LocationMap address={selectedEvent.address} />
                </div>
            </div>
            <div className="flex flex-col w-3/12">
                    <button className="urbanist suggest font-black text-white py-2 rounded-lg mb-6">
                        JE M'INSCRIS
                    </button>
                    <div className="flex space-x-2 self-start items-center justify-cente bg-tag-orange px-5 py-1.5 rounded-full mb-10">
                        <img className="h-4" src={`/icon-restaurant.svg`} alt="Catégorie" />
                        <p className="urbanist text-tag-orange font-black">{selectedEvent.tags.toLocaleUpperCase()}</p>
                    </div>
                    <div className="flex flex-col space-y-5">
                        <div className="flex space-x-3 justify-start items-start">
                            <img className="mt-0.5" src="/icon-round-time.svg" alt="Date" />
                            <p className="flex flex-col leading-tight">
                                <span className="font-semibold text-gray-400">Date</span>
                                <span className="font-bold">{format(new Date(selectedEvent.date), "EEE dd MMMM yyyy, H'h'mm", { locale: fr })}</span>
                            </p>
                        </div>
                        <div className="flex space-x-3 justify-start items-start">
                            <img className="mt-0.5" src="/icon-round-location.svg" alt="Adresse" />
                            <p className="flex flex-col leading-tight">
                                <span className="font-semibold text-gray-400">Adresse</span>
                                <span className="font-bold">{selectedEvent.address}</span>
                            </p>
                        </div>
                        <div className="flex space-x-3 justify-start items-start">
                            <img className="mt-0.5" src="/icon-round-station.svg" alt="Station" />
                            <p className="flex flex-col leading-tight">
                                <span className="font-semibold text-gray-400">Métro</span>
                                <span className="font-bold">{selectedEvent.station}</span>
                            </p>
                        </div>
                        <div className="flex space-x-3 justify-start items-start">
                            <img className="mt-0.5" src="/icon-round-people.svg" alt="People" />
                            <p className="flex flex-col leading-tight">
                                <span className="font-semibold text-gray-400">Places restantes</span>
                                <span>
                                    <span className="font-bold">{selectedEvent.participants ? `${selectedEvent.participants.length}/` : `0/`}</span><span>{selectedEvent.max_size}</span>
                                </span>
                            </p>
                        </div>
                    </div>
            </div>
        </div>
    </div>)
}

export default EventDetails;
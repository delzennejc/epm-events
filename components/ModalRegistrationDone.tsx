import { useEffect } from "react";
import { useAppActions, useAppState } from "../store";
import { EventType } from "../store/store.model";

interface ModalRegistrationDoneType {}

const ModalRegistrationDone = ({}: ModalRegistrationDoneType) => {
    const selectedEvent: EventType = useAppState(state => state.data.selectedEvent)
    if (!selectedEvent) {
        return null
    }
    return (<div className="flex flex-col px-8 md:px-16 py-6">
        <h4 className="text-xs font-black text-gray-400 mb-5">{selectedEvent.title.toUpperCase()}</h4>
        <div className="space-y-6">
            <img src="/emoji-success.svg" alt="Success" />
            <p className="text-title-orange font-extrabold text-2xl">
                Votre inscription a bien été enregistrée
            </p>
            <p className="text-sm text-gray-500">
                Un email vous a été envoyé.<br />
                Vous y retrouverez les renseignements liés à l’évènement. 
            </p>
        </div>
    </div>)
}

export default ModalRegistrationDone;
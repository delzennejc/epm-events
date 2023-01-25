import { useEffect } from "react";
import { useAppActions, useAppState } from "../store";
import { EventType } from "../store/store.model";

interface ModalRegistrationDoneType {
    isSendEmail?: boolean
}

const ModalRegistrationDone = ({ isSendEmail }: ModalRegistrationDoneType) => {
    const selectedEvent: EventType = useAppState(state => state.data.selectedEvent)
    if (!selectedEvent) {
        return null
    }
    const doneMsg = isSendEmail ? 'Votre email a bien été envoyé !' : 'Votre inscription a bien été enregistrée'
    const doneMsgAlt = isSendEmail ? `Les ${selectedEvent.participants.length} participants à l'évènement ont été alerté.` : 'Un email vous a été envoyé.'
    const doneMsgAlt2 = isSendEmail ? `Ils y retrouveront aussi les renseignements liés à l’évènement.` : 'Vous y retrouverez les renseignements liés à l’évènement.'
    return (<div className="flex flex-col px-8 md:px-16 py-6">
        <h4 className="text-xs font-black text-gray-400 mb-5">{selectedEvent.title.toUpperCase()}</h4>
        <div className="space-y-6">
            <img src="/emoji-success.svg" alt="Success" />
            <p className="text-title-orange font-extrabold text-2xl">
                {doneMsg}
            </p>
            <p className="text-sm text-gray-500">
                {doneMsgAlt}<br />
                {doneMsgAlt2} 
            </p>
        </div>
    </div>)
}

export default ModalRegistrationDone;
import Link from "next/link";
import _ from 'lodash'
import { useEffect } from "react";
import { fr } from 'date-fns/locale'
import { addDays, subDays, format } from 'date-fns';
import { useAppActions, useAppState } from "../store";
import { useRouter } from "next/router";
import { EventType, InviteType, UserType } from "../store/store.model";
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Collapsible from "./Collapsible";

interface AdminDetailsType {
}

const AdminDetails = ({ }: AdminDetailsType) => {
    const eventsStore: EventType[][] = useAppState(state => state.data.events)
    const removeParticipant = useAppActions(actions => actions.removeParticipant)
    const changeSelectedEvent = useAppActions(actions => actions.changeSelectedEvent)
    const changeIsSendEmail = useAppActions(actions => actions.changeIsSendEmail)
    const changeModalOpen = useAppActions(actions => actions.changeModalOpen)
    const events = _.flatten(eventsStore)
    const onUnSubscribe = (eventId: string, part: InviteType) => {
        if (confirm(`Est-ce que tu es sur de vouloir désinscrire: ${part.first_name} ${part.last_name}?`) == true) {
            removeParticipant({ eventId, participant: part })
        } else {
            // alert('Non')
        }
    }
    const onOpenSendEmailModal = (event: EventType) => {
        changeSelectedEvent({ selectedEvent: event })
        changeIsSendEmail(true)
        changeModalOpen({ isModalOpen: true })
    }
    return <div className="flex flex-col space-y-8">
        {events.map((event) => {
            const enfants = event?.participants?.reduce((curr, part) => curr + part.children, 0) || 0
            return (
                <div
                    key={event.id}
                    className={`card-drop-shadow w-11/12 md:w-5/6 self-center flex flex-col bg-white rounded-2xl px-5 md:px-10 py-10`}
                >
                    <div className="w-full flex justify-between">
                        <p className="flex items-center align-middle font-black text-2xl mb-6">
                            {event.title}
                        </p>
                        <button onClick={() => onOpenSendEmailModal(event)} className="urbanist suggest font-black text-white p-2 rounded-lg mb-6" type="submit">
                            Envoyer un email
                        </button>
                    </div>
                    <Collapsible>
                        <div className="">
                            <p className="font-bold text-lg mb-3">
                                {event?.participants ? event.participants.length : '0'} inscrits, avec {enfants} enfant(s)
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {event?.participants.map((part) => (
                                    <div key={part.id} className="flex bg-light-grey p-3 rounded-md">
                                        <img className="w-12 inline-block self-start mr-2" src="/admin-avatar.svg" alt="avatar" />
                                        <div className="">
                                            <p className="font-bold text-sm">{part.first_name} {part.last_name}</p>
                                            <p className="text-sm">{part.email}</p>
                                            <p className="text-sm">{part.phone} {part.children ? `${part.children} enfant(s)` : 'sans enfant'}</p>
                                            <button onClick={() => onUnSubscribe(event.id, part)} className={`urbanist border-2 font-extrabold rounded-xl px-4 h-8 text-sm text-gray-400 mt-2`}>
                                                DÉSINSCRIRE
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Collapsible>
                </div>
            )}
        )}
    </div>
}

export default AdminDetails;
import Link from "next/link";
import _ from 'lodash'
import { useEffect } from "react";
import { fr } from 'date-fns/locale'
import { addDays, subDays, format } from 'date-fns';
import { useAppActions, useAppState } from "../store";
import { useRouter } from "next/router";
import { EventType, UserType } from "../store/store.model";
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";

interface AdminDetailsType {
}

const AdminDetails = ({ }: AdminDetailsType) => {
    const eventsStore: EventType[][] = useAppState(state => state.data.events)
    const events = _.flatten(eventsStore)
    return <div className="flex flex-col space-y-8">
        {events.map((event) => (
            <div 
                className={`card-drop-shadow w-11/12 md:w-5/6 self-center flex flex-col bg-white rounded-2xl px-5 md:px-10 py-10`}
            >
                <p className="w-full flex items-center align-middle font-black text-2xl mb-6">
                    {event.title}
                </p>
                <div className="">
                    <p className="font-bold text-lg">{event?.participants ? event.participants.length : '0'} inscrits</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {event.participants.map((part) => (
                            <div className="flex bg-light-grey p-3 rounded-md">
                                <img className="w-12 inline-block self-start mr-2" src="/admin-avatar.svg" alt="avatar" />
                                <div className="">
                                    <p className="font-bold text-sm">{part.first_name} {part.last_name}</p>
                                    <p className="text-sm">{part.email}</p>
                                    <p className="text-sm">{part.phone} {part.children ? `${part.children} enfant(s)` : 'sans enfant'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
}

export default AdminDetails;
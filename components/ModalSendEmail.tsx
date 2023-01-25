import { useEffect } from "react";
import _ from 'lodash'
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useAppActions, useAppState } from "../store";
import { EventType } from "../store/store.model";
import { notifyParticipant } from "../utils/sendEmails";

interface ModalSendEmailType {}

const initialValues = {
    mail: '',
}

const loginSchema = Yup.object().shape({
    mail: Yup.string().min(10, "Il faut écrire au minimum 10 caractères.").required('Requis'),
})

const ModalSendEmail = ({}: ModalSendEmailType) => {
    const selectedEvent: EventType = useAppState(state => state.data.selectedEvent)
    const sendEmail = useAppActions(actions => actions.sendEmail)
    if (!selectedEvent) {
        return null
    }
    return (<div className="flex flex-col px-8 md:px-16 py-6">
        <h4 className="text-xs font-black text-gray-400 mb-5">{selectedEvent.title.toUpperCase()}</h4>
        <div className="w-full space-y-6">
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                if (confirm(`Voulez-vous vraiment envoyer cet email a tout les participants?`)) {
                    const message = values.mail.split(/\r?\n|\r|\n/g)
                    console.log('Mail: ', message)
                    sendEmail(message)
                } else {
                    // alert('Non')
                }
            }}
            validationSchema={loginSchema}
        >
            {({ 
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <Form className="w-full flex flex-col pb-10 space-y-4">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                            <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`mail`}>Rédiger le Mail</label>
                            <Field className="w-full bg-input-orange rounded-lg pt-3 pl-4" rows={5} component="textarea" type="textarea" name={`mail`} placeholder="Bonjour, ..." />
                            <ErrorMessage className="text-tag-orange" component="span" name={`mail`} />
                        </div>
                    </div>
                    <button className="urbanist suggest font-black text-white py-2 rounded-lg mb-6" type="submit" disabled={isSubmitting}>
                        ENVOYER LE MAIL
                    </button>
                </Form>
            )}
        </Formik>
        </div>
    </div>)
}

export default ModalSendEmail;
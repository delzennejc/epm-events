import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash'
import { useAppActions, useAppState } from "../store";
import { EditUserType, EventType, InviteType, ParticipantsType, UserType } from "../store/store.model";

interface ModalRegistrationType {}

const registrationSchema = Yup.object().shape({
    friends: Yup.array().of(
        Yup.object().shape({
            last_name: Yup.string().trim()
              .required('Requis'),
            first_name: Yup.string().trim()
              .required('Requis'),
            email: Yup.string().trim().email('Email Invalide').required('Requis'),
            phone: Yup.string().trim().min(10, 'Téléphone doit contenir 10 chiffre').matches(/0[1-9]([0-9][0-9])+/, "Téléphone n'est pas un numéro").required('Requis'),
            isChildren: Yup.boolean(),
            children: Yup.number(),
            extends: Yup.array().of(Yup.object().shape({ name: Yup.string(), checked: Yup.boolean() })),
        })
    )
})

const ModalRegistration = ({}: ModalRegistrationType) => {
    const user: UserType = useAppState(state => state.data.user)
    const selectedEvent: EventType = useAppState(state => state.data.selectedEvent)
    const selectedUser: EditUserType | null = useAppState(state => state.data.selectedUser)
    const isEditUser: boolean = useAppState(state => state.data.ui.isEditUser)
    const isAddInvite: boolean = useAppState(state => state.data.ui.isAddInvite)
    const changeAddNewInvite = useAppActions(actions => actions.changeAddNewInvite)
    const addParticipants = useAppActions(actions => actions.addParticipants)
    const removeParticipant = useAppActions(actions => actions.removeParticipant)
    const deleteUser = useAppActions(actions => actions.deleteUser)
    const editUser = useAppActions(actions => actions.editUser)
    const editParticipant = useAppActions(actions => actions.editParticipant)
    if (!selectedEvent) {
        return null
    }

    let friendDefault = { 
        last_name: '', 
        first_name: '', 
        email: '', 
        phone: '', 
        isChildren: false, 
        children: 0,
        extends: selectedEvent.extend_form,
    }
    const isShowList = user?.last_name && !isEditUser && !isAddInvite
    const isShowForm = !user?.last_name || isEditUser || isAddInvite
    const friends = (isEditUser || isAddInvite)
        ? [{
            ..._.omit(selectedUser?.user, ['invited']),
            isChildren: Boolean(selectedUser?.user?.children),
            extends: selectedEvent.extend_form,
          }]
        : [
            { ...friendDefault },
          ]

    const participants =  [
        user,
        ...user.invited,
    ]

    const initialValues = {
        friends: friends,
    };

    const removeUser = (isSubbed: boolean, eventId: string, part: InviteType) => {
        if (isSubbed) {
            removeParticipant({ eventId: selectedEvent.id, participant: part })
            deleteUser({ user: part })
        } else {
            deleteUser({ user: part })
        }
    }

    return (<div className="px-4 md:px-16 py-6">
        <h4 className="text-xs font-black text-gray-400 mb-5">{selectedEvent.title.toUpperCase()}</h4>
        <p className="text-title-orange font-extrabold text-xl mb-6">{isEditUser ? 'Modifier les informations' : 'Inscription'}</p>
        {(isShowList) && (
            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    Personnes à inscrire
                </p>
                <div className="bg-list space-y-4">
                {participants.map((part) => {
                    const isSubs = part.event_ids.includes(selectedEvent.id)
                    const maybeUser = part as any
                    const type = maybeUser?.invited ? 'user' : 'invite'
                    const buttonText = isSubs ? 'DÉSINSCRIRE' : 'INSCRIRE'
                    const buttonStyle = isSubs ? 'text-title-orange border-red-500' : 'text-blue-600 border-blue-600'
                    const buttonClick = isSubs 
                        ? () => removeParticipant({ eventId: selectedEvent.id, participant: part }) 
                        : () => editUser({ user: part, type: type })
                        // : () => addParticipants({ eventId: selectedEvent.id, participants: [part], type: type })
                    return (<div key={part.id} className="w-full flex flex-col md:flex-row rounded-xl px-4 py-2">
                        <div className="flex items-center">
                            <img className="mr-3" src="/avatar-default.svg" alt="Avatar" />
                            <div className="w-full flex flex-col leading-snug">
                                <p className="w-full relative flex font-extrabold">
                                    <p className="break-words max-w-[80%] md:max-w-none">{part.first_name} {part.last_name}</p>
                                    <img onClick={() => editUser({ user: part, type: type })} className="absolute w-8 md:w-auto right-0 md:-right-7 -top-0.5 px-2 py-2 cursor-pointer" src="/icon-edit.svg" alt="edit" />
                                </p>
                                <p>{part?.children ? `${part.children} enfant(s)` : "Pas d'enfant(s)"}</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0 md:ml-auto">
                            <button onClick={buttonClick} className={`urbanist ${buttonStyle} border-2 font-extrabold rounded-xl px-4 h-10`}>
                                {buttonText}
                            </button>
                            {type === 'invite' && <img onClick={() => removeUser(isSubs, selectedEvent.id, part)} className="ml-4 cursor-pointer" src="/icon-trash.svg" alt="delete" />}
                        </div>
                    </div>)
                })}
                </div>
            </div>
        )}
        {isShowList && <p onClick={() => changeAddNewInvite(true)} className="urbanist flex justify-center text-linear-orange text-lg font-black px-2 mt-10 cursor-pointer">
            AJOUTER UNE PERSONNE
        </p>}
        {isShowForm && <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                if (isEditUser) {
                    const isSubbed = selectedEvent?.participants.find((part) => {
                        return part.id === selectedUser?.user.id
                    })
                    if (isSubbed) {
                        editParticipant({
                            user: { 
                                ...values.friends[0],
                                children: values.friends[0].isChildren ? values.friends[0].children : 0,
                            },
                            type: selectedUser?.type,
                        })
                    } else {
                        addParticipants({ participants: values.friends, eventId: selectedEvent.id, type: selectedUser?.type, })
                    }
                    setSubmitting(false)
                } else {
                    console.log('Create, ', values)
                    const vals = values.friends.map(val => ({ ...val, id: uuidv4(), children: val.children ? val.children : 0 }))
                    addParticipants({ participants: vals, eventId: selectedEvent.id })
                    setSubmitting(false)
                }
            }}
            validationSchema={registrationSchema}
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
                <Form className="flex flex-col space-y-4">
                    {console.log(errors)}
                    <FieldArray name="friends">
                        {({ insert, remove, push }) => (
                            <>
                                {values?.friends.map((friend, index) => (
                                    <>
                                        {index > 0 && <p className="w-full flex items-center align-middle text-title-orange font-extrabold text-xl pt-5 mb-6">
                                            Inscription de l&apos;invité {index}
                                            <span onClick={() => remove(index)} className="urbanist ml-auto text-xs cursor-pointer">SUPPRIMER</span>
                                        </p>}
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex flex-col">
                                                <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`friends.${index}.last_name`}>Nom</label>
                                                <Field className="bg-input-orange h-11 rounded-lg pl-4" type="text" name={`friends.${index}.last_name`} placeholder="Dupont" />
                                                <ErrorMessage className="text-tag-orange" component="span" name={`friends.${index}.last_name`} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`friends.${index}.first_name`}>Prénom</label>
                                                <Field className="bg-input-orange h-11 rounded-lg pl-4" type="text" name={`friends.${index}.first_name`} placeholder="Martin" />
                                                <ErrorMessage className="text-tag-orange" component="span" name={`friends.${index}.first_name`} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`friends.${index}.email`}>Email</label>
                                                <Field className="bg-input-orange h-11 rounded-lg pl-4" type="email" name={`friends.${index}.email`} placeholder="martin@gmail.com" />
                                                <ErrorMessage className="text-tag-orange" component="span" name={`friends.${index}.email`} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`friends.${index}.phone`}>Téléphone</label>
                                                <Field className="bg-input-orange h-11 rounded-lg pl-4" type="text" name={`friends.${index}.phone`} placeholder="0612345678" />
                                                <ErrorMessage className="text-tag-orange" component="span" name={`friends.${index}.phone`} />
                                            </div>
                                            <label className="space-x-2">
                                                <Field type="checkbox" name={`friends.${index}.isChildren`} />
                                                <span>Je viens avec un ou plusieurs enfants (-12 ans)</span>
                                            </label>
                                            {friend.isChildren && (
                                                <div className="flex flex-col">
                                                    <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`friends.${index}.children`}>Nombre d&apos;enfants présent</label>
                                                    <Field className="self-start w-2/6 bg-input-orange h-11 rounded-lg pl-4" type="number" name={`friends.${index}.children`} />
                                                    <ErrorMessage className="text-tag-orange" component="span" name={`friends.${index}.children`} />
                                                </div>
                                            )}
                                            {friend.extends.length > 0 && (<div className="flex items-center">
                                                <div className="flex-1 flex-shrink border-b-2 border-gray-400 mr-2"></div>
                                                <p className="inline-block">Choisissez vos options</p>
                                                <div className="flex-1 flex-shrink border-b-2 border-gray-400 ml-2"></div>
                                            </div>)}
                                            {friend.extends.map((ext, y) => (
                                                <label key={ext.label} className="space-x-2">
                                                    <Field type="checkbox" name={`friends.${index}.extends.${y}.checked`} />
                                                    <span>{ext.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </>
                                ))}
                                {!isEditUser && <p onClick={() => insert(values.friends.length + 1, friendDefault)} className="urbanist text-linear-orange text-lg font-black px-2 cursor-pointer">
                                    AJOUTER UNE PERSONNE
                                </p>}
                            </>
                        )}
                    </FieldArray>
                    <button className="urbanist suggest font-black text-white py-2 rounded-lg mb-6" type="submit" disabled={isSubmitting}>
                        ENREGISTRER
                    </button>
                </Form>
            )}
        </Formik>}
    </div>)
}

export default ModalRegistration;
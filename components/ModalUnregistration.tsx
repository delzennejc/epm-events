import { useEffect } from "react";
import _ from 'lodash'
import { useAppActions, useAppState } from "../store";
import { EventType, InviteType, ParticipantsType, UserType } from "../store/store.model";

interface ModalUnregistrationType {}

const ModalUnregistration = ({}: ModalUnregistrationType) => {
    const selectedEvent: EventType = useAppState(state => state.data.selectedEvent)
    const user: UserType = useAppState(state => state.data.user)
    const addParticipants = useAppActions(actions => actions.addParticipants)
    const removeParticipant = useAppActions(actions => actions.removeParticipant)
    const changeAddNewInvite = useAppActions(actions => actions.changeAddNewInvite)
    const editUser = useAppActions(actions => actions.editUser)
    const deleteUser = useAppActions(actions => actions.deleteUser)
    if (!selectedEvent) {
        return null
    }

    const eventParticipants = selectedEvent.participants?.reduce((sum: any, part) => {
        const invitedIds = user.invited.map(val => val.id)
        if (part.id === user.id || invitedIds.includes(part.id)) {
            const isUser = user.id === part.id
            const userEventIds = user.event_ids
            const userInvited = user?.invited
            const inviteEventIds = !isUser ? user.invited.find(val => val.id === part.id)?.event_ids : null
            return [
                ...sum,
                {
                    ...part,
                    event_ids: isUser ? userEventIds : inviteEventIds,
                    invited: isUser ? userInvited : undefined,
                }
            ]
        }
        return sum
    }, []) as InviteType[] || []
    const participantsId = eventParticipants.map(val => val.id)
    const includeUser = !participantsId.includes(user?.id) ? user : null
    const myParts = user.invited.filter(val => !participantsId.includes(val.id))
    const participants = _.compact([includeUser, ...eventParticipants, ...myParts])

    const removeUser = (isSubbed: boolean, eventId: string, part: InviteType) => {
        if (isSubbed) {
            removeParticipant({ eventId: selectedEvent.id, participant: part })
            deleteUser({ user: part })
        } else {
            deleteUser({ user: part })
        }
    }

    return (<div className="flex flex-col px-8 py-6">
        <h4 className="text-xs font-black text-gray-400 mb-5">{selectedEvent.title.toUpperCase()}</h4>
        <p className="text-title-orange font-extrabold text-xl mb-6">Désinscription</p>
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Personnes à désinscrire
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
                        : () => addParticipants({ eventId: selectedEvent.id, participants: [part], type: type })
                    return (<div className="w-full flex items-center rounded-xl px-4 py-2">
                        <img className="mr-3" src="/avatar-default.svg" alt="Avatar" />
                        <div className="flex flex-col leading-snug">
                            <p className="relative flex font-extrabold">
                                <span>{part.first_name} {part.last_name}</span>
                                <img onClick={() => editUser({ user: part, type: type })} className="absolute -right-7 -top-0.5 px-2 py-2 cursor-pointer" src="/icon-edit.svg" alt="edit" />
                            </p>
                            <p>{part?.children ? `${part.children} enfant(s)` : "Pas d'enfant(s)"}</p>
                        </div>
                        <button onClick={buttonClick} className={`urbanist ${buttonStyle} ml-auto border-2 font-extrabold rounded-xl px-4 h-10`}>
                            {buttonText}
                        </button>
                        {type === 'invite' && <img onClick={() => removeUser(isSubs, selectedEvent.id, part)} className="ml-4 cursor-pointer" src="/icon-trash.svg" alt="delete" />}
                    </div>)
                })}
                <p onClick={() => changeAddNewInvite(true)} className="urbanist flex justify-center text-linear-orange text-lg font-black px-2 mt-10 cursor-pointer">
                    AJOUTER UNE PERSONNE
                </p>
            </div>
        </div>
    </div>)
}

export default ModalUnregistration;
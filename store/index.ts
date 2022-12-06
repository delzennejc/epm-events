import axios from 'axios'
import { createStore, useStoreState, useStoreActions, action, thunk, computed, thunkOn, persist, actionOn, Action } from 'easy-peasy'
import localforage from 'localforage'
import { EventListType, EventType, ChangeModalOpenType, StoreActions, StoreActionsParams, StoreActionType, StoreDataType, StoreState, StoreStateParam, StoreType, ChangeSelectedEventType, AddParticipantsType, RemoveParticipantType, DeleteUserType, EditUserType } from './store.model';
import _ from 'lodash'

import { supabaseClient } from '../utils/supabaseClient';
import { addMonths, isAfter, format, compareDesc, endOfISOWeek, startOfISOWeek, subDays, addDays } from 'date-fns'
import { frenchDate, sortDate } from '../utils/utils';
import { getDates } from '../utils/timeSince';
import { SendEmails } from '../pages/api/notify';
import { sendEmail } from '../utils/sendEmails';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const storeModelData = {
    data: {
        ui: {
            loading: true,
            isModalOpen: false,
            addParticipantSuccess: false,
            isMobile: false,
            isEditUser: false,
            isAddInvite: false,
        },
        selectedEvent: null,
        selectedUser: null,
        events: [],
        user: persist({
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            children: 0,
            invited: [],
            event_ids: [],
        }, { storage: localforage }),
    },
    changeLoading: action<StoreType, boolean>((state, payload) => {
        state.data.ui.loading = payload
    }),
    addEventToUser: action<StoreType, AddParticipantsType>((state, payload) => {
        if (payload.type) {
            if (payload.type === 'user') {
                state.data.user.event_ids = [...state.data.user.event_ids, payload.eventId]
            } else {
                state.data.user.invited = state.data.user.invited.map(val => {
                    if (val.id === payload.participants[0].id) {
                        return ({
                            ...val,
                            event_ids: [...val.event_ids, payload.eventId],
                        })
                    }
                    return val
                })
            }
        } else {
            state.data.ui.addParticipantSuccess = true
            const user = state.data.user
            if (!user?.id) {
                const newUser = _.omit(payload.participants[0], ['isChildren'])
                state.data.user = {
                    ...state.data.user,
                    ...newUser,
                    event_ids: state.data.user.event_ids.includes(payload.eventId) ? state.data.user.event_ids : [...state.data.user.event_ids, payload.eventId],
                }
            }
            if (payload.participants.length > 1 || user?.id) {
                payload.participants.forEach((val, i) => {
                    if (i > 0 || user?.id) {
                        let modified = false
                        const invitee = _.omit(val, ['isChildren'])
                        state.data.user.invited.map((inv) => {
                            if (inv.id === val.id) {
                                modified = true
                                return {
                                    ...inv,
                                    event_ids: inv.event_ids.includes(payload.eventId) ? inv.event_ids : [...inv.event_ids, payload.eventId],
                                }
                            }
                            return inv
                        })
                        if (!modified) {
                            state.data.user.invited.push({
                                event_ids: [payload.eventId],
                                ...invitee,
                            })
                        }
                    }
                })
                state.data.ui.isAddInvite = false
            }
        }
    }),
    removeEventToUser: action<StoreType, RemoveParticipantType>((state, payload) => {
        const user = state.data.user
        const invited = user.invited.find(val => val.id === payload.participant.id)
        if (user.id === payload.participant.id) {
            state.data.user.event_ids = user.event_ids.filter(id => id !== payload.eventId)
        } else if (invited) {
            state.data.user.invited = _.compact(user.invited.map(val => {
                if (val.id === payload.participant.id) {
                    if (val.event_ids.length > 1) {
                        return ({
                            ...val,
                            event_ids: val.event_ids.filter(id => id !== payload.eventId)
                        })
                    } else {
                        return ({
                            ...val,
                            event_ids: []
                        })
                    }
                }
                return val
            }))
        }
    }),
    editUser: action<StoreType, EditUserType>((state, payload) => {
        state.data.selectedUser = payload
        state.data.ui.isEditUser = true
    }),
    saveEditedUser: action<StoreType, EditUserType>((state, payload) => {
        if (payload.type === 'user') {
            state.data.user.last_name = payload.user.last_name
            state.data.user.first_name = payload.user.first_name
            state.data.user.email = payload.user.email
            state.data.user.phone = payload.user.phone
            state.data.user.children = payload.user.children
        } else {
            state.data.user.invited.map(inv => {
                if (inv.id === payload.user.id) {
                    return ({
                        ...inv,
                        last_name: payload.user.last_name,
                        first_name: payload.user.first_name,
                        email: payload.user.email,
                        phone: payload.user.phone,
                        children: payload.user.children,
                    })
                }
                return inv
            })
        }
        state.data.ui.isEditUser = false
        state.data.selectedUser = null
    }),
    deleteUser: action<StoreType, DeleteUserType>((state, payload) => {
        const user = state.data.user
        state.data.user.invited = _.compact(user.invited.map(val => {
            if (val.id === payload.user.id) {
                return null
            }
            return val
        }))
    }),
    changeIsMobile: action<StoreType, boolean>((state, payload) => {
        state.data.ui.isMobile = payload
    }),
    changeSelectedEvent: action<StoreType, ChangeSelectedEventType>((state, { selectedEvent }) => {
        state.data.selectedEvent = selectedEvent
    }),
    changeAddNewInvite: action<StoreType, boolean>((state, payload) => {
        state.data.ui.isAddInvite = payload
    }),
    changeModalOpen: action<StoreType, ChangeModalOpenType>((state, { isModalOpen }) => {
        state.data.ui.isModalOpen = isModalOpen
        if (isModalOpen === false) {
            state.data.ui.addParticipantSuccess = false
            state.data.ui.isEditUser = false
            state.data.ui.isAddInvite = false
            state.data.selectedUser = null
        }
    }),
    initializeStore: thunk<StoreActionType, void, any, StoreType>(async (actions, payload, store) => {
        try {
            actions.changeLoading(true)
            await actions.getEvents()
            actions.changeLoading(false)
        } catch (e) {
            console.error(e)
            actions.changeLoading(false)
        }
    }),
    addEvents: action<StoreType, EventType[]>((state, events) => {
        const arrayDates = events.reduce((sum: any[], curr: any, i) => {
            let newSum = [...sum]
            if (i === 0) {
                newSum[0] = [curr]
                return newSum
            }
            if (sum[i - 1]?.length === 1 && (i - 1) !== 0) {
                newSum[i - 1] = [...newSum[i - 1], curr]
                return newSum
            }
            newSum[i] = [curr]
            return newSum
        }, [])
        state.data.events = arrayDates as EventListType
    }),
    getEvents: thunk<StoreActionType, void, any, StoreType>(async (actions, payload, store) => {
        try {
            const { data:events } = await supabaseClient
                .from('events')
                .select()
                .not('date', 'is', null)
                .order('date', { ascending: true })
            console.log('Events: ', events)
            actions.addEvents(events as EventType[])
        } catch (e) {
            console.error(e)
            actions.changeLoading(false)
        }
    }),
    addParticipants: thunk<StoreActionType, AddParticipantsType, any, StoreType>(async (actions, payload, store) => {
        try {
            const state = store.getStoreState()
            const selectedEvent = _.flatten(state.data.events).find(val => val.id === payload.eventId)
            if (!selectedEvent) return
            const participants = selectedEvent?.participants || []
            const newEvent = {
                ...selectedEvent,
                participants: [
                    ...participants,
                    ...payload.participants.map((val) => _.omit(val, ['isChildren']))
                ]
            }
            const { data:eventUpdated } = await supabaseClient
                .from('events')
                .update(newEvent)
                .eq('id', payload.eventId)
                .select()
                .maybeSingle()
            actions.addEventToUser(payload)
            const invites = payload.participants.map<SendEmails>((part) => ({
                id: selectedEvent.id,
                name: `${part.first_name} ${part.last_name}`,
                email: part.email,
                phone: part.phone,
                children: part.children,
                title: selectedEvent.title,
                date: frenchDate(selectedEvent.date),
                address: selectedEvent.address,
                metro: selectedEvent.station,
                link: `${baseUrl}/event/${selectedEvent.id}`,
            }))
            actions.getEvents()
            const emailSent = await sendEmail(invites)
        } catch (e) {
            console.error(e)
            actions.changeLoading(false)
        }
    }),
    editParticipant: thunk<StoreActionType, EditUserType, any, StoreType>(async (actions, payload, store) => {
        try {
            const state = store.getStoreState()
            const selectedEvent = state.data.selectedEvent
            if (!selectedEvent?.id) return
            if (payload.user.event_ids.includes(selectedEvent.id)) {
                const participants = selectedEvent?.participants || []
                const newEvent = {
                    ...selectedEvent,
                    participants: participants.map(val => {
                        if (payload.user.id === val.id) {
                            return ({
                                ...val,
                                last_name: payload.user.last_name,
                                first_name: payload.user.first_name,
                                email: payload.user.email,
                                phone: payload.user.phone,
                                children: payload.user.children,
                            })
                        }
                        return val
                    })
                }
                const { data:eventUpdated } = await supabaseClient
                    .from('events')
                    .update(newEvent)
                    .eq('id', selectedEvent.id)
                    .select()
                    .maybeSingle()
                actions.saveEditedUser(payload)
                actions.getEvents()
            } else {
                actions.saveEditedUser(payload)
            }
            
        } catch (e) {
            console.error(e)
            actions.changeLoading(false)
        }
    }),
    removeParticipant: thunk<StoreActionType, RemoveParticipantType, any, StoreType>(async (actions, payload, store) => {
        try {
            const state = store.getStoreState()
            const selectedEvent = _.flatten(state.data.events).find(val => val.id === payload.eventId)
            const participants = selectedEvent?.participants || []
            const newEvent = {
                ...selectedEvent,
                participants: participants.filter(val => val.id !== payload.participant.id)
            }
            const { data:eventUpdated } = await supabaseClient
                .from('events')
                .update(newEvent)
                .eq('id', payload.eventId)
                .select()
                .maybeSingle()
            actions.removeEventToUser(payload)
            console.log('Events: ', eventUpdated)
            actions.getEvents()
        } catch (e) {
            console.error(e)
            actions.changeLoading(false)
        }
    }),
}

const store = createStore<StoreType>(storeModelData)

export const useAppActions = (action: StoreActionsParams) => {
    return useStoreActions<StoreActions>(action)
}

export const useAppState = (state: StoreStateParam) => {
    return useStoreState<StoreState>(state)
}

export default store;
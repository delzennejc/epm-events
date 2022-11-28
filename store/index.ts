import axios from 'axios'
import { createStore, useStoreState, useStoreActions, action, thunk, computed, thunkOn, persist, actionOn, Action } from 'easy-peasy'
import localforage from 'localforage'
import { EventListType, EventType, ChangeModalOpenType, ChangeViewerOpenType, StoreActions, StoreActionsParams, StoreActionType, StoreDataType, StoreState, StoreStateParam, StoreType } from './store.model';
import _ from 'lodash'

import { supabaseClient } from '../utils/supabaseClient';
import { addMonths, isAfter, format, compareDesc, endOfISOWeek, startOfISOWeek, subDays, addDays } from 'date-fns'
import { sortDate } from '../utils/utils';
import { getDates } from '../utils/timeSince';

export const storeModelData = {
    data: {
        ui: {
            loading: true,
            isModalOpen: false,
            isViewerOpen: false,
            currentImg: 0,
            isMobile: false,
        },
        selectedEvent: null,
        events: [],
        user: persist({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            children: undefined,
            invited: [],
            events: [],
        }, { storage: localforage }),
    },
    changeLoading: action<StoreType, boolean>((state, payload) => {
        state.data.ui.loading = payload
    }),
    changeIsMobile: action<StoreType, boolean>((state, payload) => {
        state.data.ui.isMobile = payload
    }),
    changeModalOpen: action<StoreType, ChangeModalOpenType>((state, { isModalOpen, selectedEvent = null}) => {
        state.data.selectedEvent = selectedEvent
        state.data.ui.isModalOpen = isModalOpen
    }),
    changeViewerOpen: action<StoreType, ChangeViewerOpenType>((state, { isViewerOpen, index}) => {
        state.data.ui.currentImg = index
        state.data.ui.isViewerOpen = isViewerOpen
    }),
    removeModal: action<StoreType, void>((state, payload) => {
        state.data.ui.isModalOpen = false
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
        // const arrayDates = _.groupBy(sortDate(events || [], 'published_at'), (app) => format(new Date(app.published_at), 'LL/d/yyyy')) as unknown
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
}

const store = createStore<StoreType>(storeModelData)

export const useAppActions = (action: StoreActionsParams) => {
    return useStoreActions<StoreActions>(action)
}

export const useAppState = (state: StoreStateParam) => {
    return useStoreState<StoreState>(state)
}

export default store;
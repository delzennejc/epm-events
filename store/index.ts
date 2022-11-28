import axios from 'axios'
import { createStore, useStoreState, useStoreActions, action, thunk, computed, thunkOn, persist, actionOn, Action } from 'easy-peasy'
import localforage from 'localforage'
import { AppsListType, AppsType, ChangeModalOpenType, ChangeUpvotesType, ChangeViewerOpenType, StoreActions, StoreActionsParams, StoreActionType, StoreDataType, StoreState, StoreStateParam, StoreType, UpdateUpvotesType } from './store.model';
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
        selectedApp: null,
        apps: {},
        user: persist({
            email: '',
            upvotes: [],
        }, { storage: localforage }),
    },
    changeLoading: action<StoreType, boolean>((state, payload) => {
        state.data.ui.loading = payload
    }),
    changeIsMobile: action<StoreType, boolean>((state, payload) => {
        state.data.ui.isMobile = payload
    }),
    changeModalOpen: action<StoreType, ChangeModalOpenType>((state, { isModalOpen, selectedApp = null}) => {
        state.data.selectedApp = selectedApp
        state.data.ui.isModalOpen = isModalOpen
    }),
    changeViewerOpen: action<StoreType, ChangeViewerOpenType>((state, { isViewerOpen, index}) => {
        state.data.ui.currentImg = index
        state.data.ui.isViewerOpen = isViewerOpen
    }),
    removeModal: action<StoreType, void>((state, payload) => {
        state.data.ui.isModalOpen = false
    }),
    changeUpvote: action<StoreType, ChangeUpvotesType>((state, {id, key, substract = false}) => {
        if (substract) {
            state.data.user.upvotes = state.data.user.upvotes.filter(pId => pId !== id)
        } else {
            state.data.user.upvotes.push(id)
        }
        state.data.apps[key] = state.data.apps[key].map((app) => {
            if (app.id === id) {
                const upvotes = substract ? app.upvotes - 1 : app.upvotes + 1
                return {
                    ...app,
                    upvotes: upvotes
                }
            }
            return app
        })
    }),
    initializeStore: thunk<StoreActionType, void, any, StoreType>(async (actions, payload, store) => {
        try {
            actions.changeLoading(true)
            await actions.getApps()
            actions.changeLoading(false)
        } catch (e) {
            console.error(e)
            actions.changeLoading(false)
        }
    }),
    addApps: action<StoreType, AppsType[]>((state, apps) => {
        // const arrayDates = _.groupBy(sortDate(apps || [], 'published_at'), (app) => format(new Date(app.published_at), 'LL/d/yyyy')) as unknown
        const arrayDates =_.groupBy(apps, (app) => format(new Date(app.published_at), 'LL/d/yyyy')) as unknown
        state.data.apps = arrayDates as AppsListType
    }),
    getApps: thunk<StoreActionType, void, any, StoreType>(async (actions, payload, store) => {
        try {
            const { data:apps } = await supabaseClient
                .from('apps')
                .select()
                .not('published_at', 'is', null)
                .order('published_at', { ascending: false })
            actions.addApps(apps as AppsType[])
        } catch (e) {
            console.error(e)
            actions.changeLoading(false)
        }
    }),
    updateUpvotes: thunk<StoreActionType, UpdateUpvotesType, any, StoreType>(async (actions, {id, upvotes, key}, store) => {
        try {
            const state = store.getStoreState()
            if (!state.data.user.upvotes.includes(id)) {
                actions.changeUpvote({ id, key })
                const { data:app } = await supabaseClient
                    .from('apps')
                    .update({ upvotes: upvotes + 1 })
                    .match({ id })
                    .maybeSingle()     
                actions.getApps()
            } else {
                actions.changeUpvote({ id, key, substract: true })
                const { data:app } = await supabaseClient
                    .from('apps')
                    .update({ upvotes: upvotes - 1 })
                    .match({ id })
                    .maybeSingle()
                actions.getApps()
            }
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
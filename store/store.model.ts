import { Thunk, Action, Actions, State, StateMapper, Computed, ThunkOn, ActionOn } from 'easy-peasy'

/**
 * USER DATA
 */

 export interface UserType {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    events: EventType[];
    children?: number;
    invited: InviteType[];
 }

 export interface InviteType {
    event_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    children: null;
 }

 /**
 * Event
 */

 export interface EventType {
    id: string;
    image: string;
    title: string;
    description: string;
    date: Date;
    address: string;
    station: string;
    max_size: number;
    participants: InviteType[]; // To Define Object[]
    tags: string[];
    link: string;
    published_at: Date;
    created_at: Date;
}

 /**
 * EventList
 */

export type EventListType = EventType[][]

 /**
 * Actions
 */

export interface ChangeModalOpenType {
    isModalOpen: boolean;
    selectedEvent: EventType;
}

export interface ChangeViewerOpenType {
    isViewerOpen: boolean;
    index: number;
}


/**
 * STORE
 */

export type StoreActions = Actions<Omit<StoreType, 'data'>>;
export type StoreState = State<StoreType>;

export type StoreStateParam = (param: StoreState) => any
export type StoreActionsParams = (param: StoreActions) => any

export interface StoreDataType {
    user: UserType;
    events: EventListType;
    selectedEvent: EventType | null;
    ui: {
        loading: boolean;
        isModalOpen: boolean;
        isViewerOpen: boolean;
        currentImg: number;
        isMobile: boolean;
    };
}

export interface StoreActionType {
    changeLoading: Action<StoreType, boolean>;
    initializeStore: Thunk<StoreActionType, void, any, StoreType>;
    changeIsMobile: Action<StoreType, boolean>;
    changeModalOpen: Action<StoreType, ChangeModalOpenType>;
    changeViewerOpen: Action<StoreType, ChangeViewerOpenType>;
    removeModal: Action<StoreType, void>;
    addEvents: Action<StoreType, EventType[]>;
    getEvents: Thunk<StoreActionType, void, any, StoreType>;
}


export interface StoreType extends StoreActionType {
    data: StoreDataType
}
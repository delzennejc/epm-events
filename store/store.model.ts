import { Thunk, Action, Actions, State, StateMapper, Computed, ThunkOn, ActionOn } from 'easy-peasy'
import { string } from 'yup';
/**
 * USER DATA
 */

 export interface UserType {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    event_ids: string[];
    children: number;
    invited: InviteType[];
 }

 export interface InviteType {
    id: string;
    event_ids: string[];
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    children: number;
 }

 export interface ParticipantsType {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    children: number;
    isChildren: boolean;
    extends: { label: string; checked: boolean }[];
    invited?: InviteType[];
    event_ids?: string[];
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
    participants: InviteType[];
    tags: string;
    link: string;
    extend_form: { label: string; checked: boolean }[];
    published_at: Date;
    created_at: Date;
    subscription_end: Date;
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
}

export interface AddParticipantsType {
    eventId: string;
    participants: ParticipantsType[];
    type?: 'invite' | 'user'
}

export interface RemoveParticipantType {
    eventId: string;
    participant: ParticipantsType;
}

export interface DeleteUserType {
    user: ParticipantsType;
}

export interface EditUserType {
    user: ParticipantsType;
    type: 'invite' | 'user';
}

export interface ChangeSelectedEventType {
    selectedEvent: EventType;
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
    selectedUser: EditUserType | null;
    ui: {
        loading: boolean;
        isModalOpen: boolean;
        isSendEmail: boolean;
        isMobile: boolean;
        addParticipantSuccess: boolean;
        isEditUser: boolean;
        isAddInvite: boolean;
        themeColor: string;
        isAdmin: boolean;
    };
}

export interface StoreActionType {
    changeLoading: Action<StoreType, boolean>;
    changeThemeColor: Action<StoreType, string>;
    initializeStore: Thunk<StoreActionType, void, any, StoreType>;
    changeIsMobile: Action<StoreType, boolean>;
    changeModalOpen: Action<StoreType, ChangeModalOpenType>;
    changeIsSendEmail: Action<StoreType, boolean>;
    changeIsAdmin: Action<StoreType, boolean>;
    changeSuccess: Action<StoreType, void>;
    changeAddNewInvite: Action<StoreType, boolean>;
    changeSelectedEvent: Action<StoreType, ChangeSelectedEventType>;
    addEventToUser: Action<StoreType, AddParticipantsType>;
    removeEventToUser: Action<StoreType, RemoveParticipantType>;
    deleteUser: Action<StoreType, DeleteUserType>;
    editUser: Action<StoreType, EditUserType>;
    saveEditedUser: Action<StoreType, EditUserType>;
    addEvents: Action<StoreType, EventType[]>;
    getEvents: Thunk<StoreActionType, void, any, StoreType>;
    sendEmail: Thunk<StoreActionType, string[], any, StoreType>;
    addParticipants: Thunk<StoreActionType, AddParticipantsType, any, StoreType>;
    editParticipant: Thunk<StoreActionType, EditUserType, any, StoreType>;
    removeParticipant: Thunk<StoreActionType, RemoveParticipantType, any, StoreType>;
}


export interface StoreType extends StoreActionType {
    data: StoreDataType
}
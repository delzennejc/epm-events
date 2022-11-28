import { Thunk, Action, Actions, State, StateMapper, Computed, ThunkOn, ActionOn } from 'easy-peasy'

/**
 * USER DATA
 */

 export interface UserType {
     email?: string;
     upvotes: string[];
 }

 /**
 * Apps
 */

 export interface AppsType {
    id: string;
    rank: number;
    name: string;
    logo: string;
    short_description: string;
    description: JSON;
    images: string[];
    link: string;
    token_id: string;
    upvotes: number;
    blockchains: string[];
    tags: string[];
    published_at: Date;
    created_at: Date;
}

 /**
 * AppsList
 */

export interface AppsListType {
    [key: string]: AppsType[]
}

 /**
 * Actions
 */

 export interface ChangeModalOpenType {
    isModalOpen: boolean;
    selectedApp: AppsType;
 }

 export interface ChangeViewerOpenType {
    isViewerOpen: boolean;
    index: number;
 }

 export interface UpdateUpvotesType {
    id: string;
    upvotes: number;
    key: string;
 }

 export interface ChangeUpvotesType {
    id: string;
    substract?: boolean;
    key: string;
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
    apps: AppsListType;
    selectedApp: AppsType | null;
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
    changeIsMobile: Action<StoreType, boolean>;
    initializeStore: Thunk<StoreActionType, void, any, StoreType>;
    changeModalOpen: Action<StoreType, ChangeModalOpenType>;
    changeViewerOpen: Action<StoreType, ChangeViewerOpenType>;
    changeUpvote: Action<StoreType, ChangeUpvotesType>;
    removeModal: Action<StoreType, void>;
    addApps: Action<StoreType, AppsType[]>;
    getApps: Thunk<StoreActionType, void, any, StoreType>;
    updateUpvotes: Thunk<StoreActionType, UpdateUpvotesType, any, StoreType>
}


export interface StoreType extends StoreActionType {
    data: StoreDataType
}
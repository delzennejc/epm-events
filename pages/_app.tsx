import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from 'lodash'
import { configResponsive, useResponsive } from 'ahooks';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';

import store, { useAppActions, useAppState } from "../store";
import * as ga from '../utils/ga'
import AppHead from '../components/AppHead';
import App from 'next/app';
import { useDisableBodyScroll } from '../utils/hooks';
import { EventListType, EventType, UserType } from '../store/store.model';
import ModalRegistration from '../components/ModalRegistration';
import ModalRegistrationDone from '../components/ModalRegistrationDone';
import ModalUnregistration from '../components/ModalUnregistration';

interface MyAppProps {
  Component: () => ReactElement;
  pageProps: any;
}

interface MyAppState {
  hideNav: boolean;
}

configResponsive({
  small: 0,
  middle: 900,
  large: 1200,
});

type MyAppBodyProps = MyAppProps & MyAppState

const MyAppBody: React.FC<MyAppBodyProps> =  ({ Component, pageProps, hideNav }) => {
  const router = useRouter()
  const responsive = useResponsive()
  const isModalOpen: boolean = useAppState((state) => state.data.ui.isModalOpen)
  const isMobile: boolean = useAppState((state) => state.data.ui.isMobile)
  const isAddInvite: boolean = useAppState(state => state.data.ui.isAddInvite)
  const isEditUser: boolean = useAppState(state => state.data.ui.isEditUser)
  const selectedEvent: EventType = useAppState((state) => state.data.selectedEvent)
  const user: UserType = useAppState((state) => state.data.user)
  const addParticipantSuccess: boolean = useAppState((state) => state.data.ui.addParticipantSuccess)
  const events: EventListType = useAppState((state) => state.data.events)
  const changeModalOpen = useAppActions(actions => actions.changeModalOpen)
  const changeSelectedEvent = useAppActions(actions => actions.changeSelectedEvent)
  const changeIsMobile = useAppActions(actions => actions.changeIsMobile)

  const closeModal = () => {
    changeModalOpen({ isModalOpen: false })
  }

  const rehydrated = useStoreRehydrated();
  const initializeStore = useAppActions(actions => actions.initializeStore)

  useEffect(() => {
      if (rehydrated) {
          initializeStore()
      }
      changeIsMobile(!Boolean(responsive['middle']))
  }, [rehydrated])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const urlDetails = router.query.eventId
  useEffect(() => {
    if (urlDetails) {
      const allEvents = _.flatMap(events)
      const selectedEvent = allEvents.find(event => event.id === urlDetails)
      changeSelectedEvent({ selectedEvent })
    }
  }, [urlDetails, events])

  
  useDisableBodyScroll(isModalOpen)
  
  const customStyles: any = {
    content: {
      position: 'relative',
      display: "block",
      top: isMobile ? '10%' : '5%',
      left: isMobile ? '50%' : '50%',
      right: 'auto',
      bottom: 'auto',
      height: 'auto',
      width: isMobile ? '94vw' : 650,
      borderRadius: isMobile ? "10px" : "10px",
      transform: isMobile ? 'translate(-50%, 0%)' : 'translate(-50%, 0%)',
      border: 'none',
      overflow: 'visible',
      WebkitOverflowScrolling: 'touch',
      zIndex: 40,
      background: "#FFFFFF",
      marginBottom: "300px",
    },
    overlay: {
      background: "linear-gradient(93.67deg, rgba(124, 52, 74, 0.5) -4.76%, rgba(137, 61, 58, 0.5) 51.75%, rgba(140, 87, 58, 0.5) 108.25%)",
      zIndex: 35,
      overflowY: "auto",
      overflowX: isMobile ? 'hidden' : undefined,
    }
  };

  if (!rehydrated) return null

  const isRegInitialValue: boolean = false
  const isFalse: boolean = false
  const isInviteRegs = user.invited.reduce((curr, val) => val.event_ids.includes(selectedEvent?.id), isRegInitialValue)
  const isRegistered = selectedEvent ? user.event_ids.includes(selectedEvent?.id) || isInviteRegs : isFalse

  return (<>
    <div className={`flex flex-row w-full h-full min-h-screen ${isModalOpen ? '' : ''}`}>
      <Component {...pageProps} />
    </div>
    <Modal 
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      preventScroll={false}
      ariaHideApp={false}
    >
      <img 
        className="absolute w-7 h-7 top-4 right-6 cursor-pointer z-40"
        src="/close-button.svg"
        alt="close button"
        onClick={closeModal}
      />
      {addParticipantSuccess 
        ? <ModalRegistrationDone />
        : (isRegistered && !isEditUser && !isAddInvite) ? <ModalUnregistration /> : <ModalRegistration />
      }
    </Modal>
  </>)
}

class MyApp extends App<MyAppProps, any, MyAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      hideNav: false,
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
      this.setState({ hideNav: window.innerWidth <= 760});
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.resize.bind(this));
  }

  render() {
    const params: any = { ...this.props, ...this.state }
    return (
      <StoreProvider store={store}>
        <>
          <AppHead />
          <MyAppBody {...params} />
          <ToastContainer toastClassName="rounded-full" bodyClassName="rounded-full" />
        </>
      </StoreProvider>
    )
  }
}


export default MyApp

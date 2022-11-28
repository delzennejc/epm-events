import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from 'lodash'
import { configResponsive, useResponsive } from 'ahooks';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
import Modal from 'react-modal';
import ImageViewer from "react-simple-image-viewer";
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
import { AppsListType, AppsType } from '../store/store.model';
import AppsDetails from '../components/AppsDetails';

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
  const selectedApp: AppsType = useAppState((state) => state.data.selectedApp)
  const apps: AppsListType = useAppState((state) => state.data.apps)
  const changeModalOpen = useAppActions(actions => actions.changeModalOpen)
  const isViewerOpen: boolean = useAppState((state) => state.data.ui.isViewerOpen)
  const currentImg: number = useAppState((state) => state.data.ui.currentImg)
  const changeViewerOpen = useAppActions(actions => actions.changeViewerOpen)
  const changeIsMobile = useAppActions(actions => actions.changeIsMobile)

  const closeImageViewer = () => {
    changeViewerOpen({ isViewerOpen: false, index: 0 })
  };

  const closeModal = () => {
    changeModalOpen({ isModalOpen: false })
    router.push('/', undefined, { shallow: true })
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

  const urlDetails = router.query.productId
  useEffect(() => {
    if (urlDetails) {
      const allApps = _.flatMap(apps)
      const selectedApp = allApps.find(app => app.id === urlDetails)
      changeModalOpen({ isModalOpen: true, selectedApp })
    }
  }, [urlDetails, apps])

  
  useDisableBodyScroll(isModalOpen)
  
  const customStyles: any = {
    content: {
      position: 'absolute',
      display: "block",
      top: isMobile ? '10%' : '10%',
      left: isMobile ? '50%' : '50%',
      right: 'auto',
      bottom: 'auto',
      height: 'auto',
      width: isMobile ? '94vw' : 800,
      borderRadius: isMobile ? "10px" : "10px",
      transform: isMobile ? 'translate(-50%, 0%)' : 'translate(-50%, 0%)',
      border: 'none',
      overflow: 'visible',
      WebkitOverflowScrolling: 'touch',
      zIndex: 40,
      background: "#362E71",
    },
    overlay: {
      background: "rgba(0, 0, 0, 60%)",
      zIndex: 35,
      overflowY: "auto",
      overflowX: isMobile ? 'hidden' : undefined
    }
  };

  if (!rehydrated) return null

  return (<>
    <div className="flex flex-row w-full h-full min-h-screen">
      <Component {...pageProps} />
    </div>
    {isViewerOpen && (
      <ImageViewer
        src={selectedApp?.images || []}
        currentIndex={currentImg}
        disableScroll={false}
        closeOnClickOutside={true}
        onClose={closeImageViewer}
        backgroundStyle={{ zIndex: 50 }}
      />
    )}
    <Modal 
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      preventScroll={false}
      ariaHideApp={false}
    >
    <img 
      className="absolute w-7 h-7 -top-10 right-2 md:-top-10 md:-right-24 cursor-pointer z-40"
      src="/close-button.svg"
      alt="close button"
      onClick={closeModal}
    />
      <AppsDetails />
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

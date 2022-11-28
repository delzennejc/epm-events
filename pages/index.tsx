import type { NextPage } from 'next'
import _ from 'lodash'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'

import Layout from '../components/Layout'
import { useAppActions, useAppState } from '../store'
import Hero from '../components/Hero';
import AppList from '../components/AppList';
import AppItem from '../components/AppItem';
import { addDays, subDays } from 'date-fns';
import { AppsListType } from '../store/store.model';
import Placeholder from '../components/Placeholder';

const Home: NextPage = () => {
  // const router = useRouter()
  const appsList: AppsListType = useAppState((state) => state.data.apps)
  const isModalOpen: boolean = useAppState((state) => state.data.ui.isModalOpen)
  const isLoading: boolean = useAppState((state) => state.data.ui.loading)
  const changeModalOpen = useAppActions(actions => actions.changeModalOpen)

  return (
    <>
    <div className="w-full h-full relative">
      <Layout>
        <div className="space-y-24 mb-24">
          EPM Event
        </div>
        <div className="mt-auto">
          <p>Fait avec ❤️ à EPM-Com</p>
        </div>
      </Layout>
    </div>
    </>
  )
}

export default Home

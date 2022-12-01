import type { NextPage } from 'next'
import _ from 'lodash'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import { useAppActions, useAppState } from '../../store';
import EventDetails from '../../components/EventDetails';


const Home: NextPage = () => {
  return (
    <>
    <div className="w-full h-full relative">
      <Layout className="justify-between px-8 pt-1">
        <div className="w-full">
          <EventDetails />
        </div>
        <div className="mt-20">
          <p>Fait avec ❤️ à EPM-Com</p>
        </div>
      </Layout>
    </div>
    </>
  )
}

export default Home

import type { NextPage } from 'next'
import _ from 'lodash'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import AppsDetails from '../../components/AppsDetails';
import { useAppActions, useAppState } from '../../store';


const Home: NextPage = () => {
  const router = useRouter()
  const isModalOpen: boolean = useAppState((state) => state.data.ui.isModalOpen)
  const removeModal = useAppActions(actions => actions.removeModal)

  useEffect(() => {
    // remove modal
    if (isModalOpen) {
        removeModal()
    }
  }, [isModalOpen])

  return (
    <>
    <div className="w-full h-full relative">
      <div
        className="absolute h-screen w-screen z-0"
      ></div>
      <Layout className="justify-between pt-6">
        <div className="w-full md:w-3/4 pb-20">
            <AppsDetails shadow={true} />
        </div>
        <div className="">
          <p>Built with ❤️ from France</p>
        </div>
      </Layout>
    </div>
    </>
  )
}

export default Home

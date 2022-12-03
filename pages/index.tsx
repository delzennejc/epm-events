import type { NextPage } from 'next'
import _ from 'lodash'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'

import Layout from '../components/Layout'
import { useAppActions, useAppState } from '../store'
import { addDays, subDays, } from 'date-fns';
import { EventListType } from '../store/store.model';
import Placeholder from '../components/Placeholder';
import EventCard from '../components/EventCard';

const Home: NextPage = () => {
  // const router = useRouter()
  const eventList: EventListType = useAppState((state) => state.data.events)
  const isModalOpen: boolean = useAppState((state) => state.data.ui.isModalOpen)
  const isLoading: boolean = useAppState((state) => state.data.ui.loading)

  return (
    <>
    <div className="w-full h-full relative">
      <Layout>
        <div className="max-w-6xl flex flex-col w-full mb-24 -mt-36">
          <p className="urbanist z-50 text-white font-black text-lg ml-14 md:ml-32 mb-4">PROCHAINS ÉVÈNEMENTS</p>
          {eventList.length > 0 && <div className="w-5/6 self-center flex justify-center mb-10">
            <EventCard
              id={eventList[0][0].id}
              image={eventList[0][0].image}
              title={eventList[0][0].title.toUpperCase()}
              time={eventList[0][0].date}
              address={eventList[0][0].address}
              station={eventList[0][0].station}
              link={`/event/${eventList[0][0].id}`}
            />
          </div>}
          {eventList.map((events, i) => {
            if (i === 0) return undefined
            return (<div className="w-5/6 self-center grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
                {events.map(event => (
                  <EventCard
                    small={true}
                    id={event.id}
                    image={event.image}
                    title={event.title}
                    time={event.date}
                    address={event.address}
                    station={event.station}
                    link={`/event/${event.id}`}
                  />
                ))}
              </div>)
            })}
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

import type { NextPage } from 'next'
import _ from 'lodash'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { useAppActions, useAppState } from '../store';
import AdminLogin from '../components/AdminLogin';
import AdminDetails from '../components/AdminDetails';


const Admin: NextPage = () => {
    const isAdmin = useAppState(state => state.data.ui.isAdmin)
    return (
        <>
        <div className="w-full h-full relative">
        <Layout className="">
            <div className="max-w-6xl flex flex-col w-full mb-24 -mt-36 md:-mt-36">
                {isAdmin && <p className="urbanist z-50 text-white font-black text-lg ml-14 md:ml-32 mb-4">ADMIN</p>}
                {isAdmin
                 ? <AdminDetails />
                 : <AdminLogin />}
            </div>
            <div className="mt-20">
            <p>Fait avec ❤️ à EPM-Com</p>
            </div>
        </Layout>
        </div>
        </>
    )
}

export default Admin

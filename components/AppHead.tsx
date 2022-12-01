import Head from "next/head"
import { useStoreRehydrated } from 'easy-peasy'
import { useEffect } from "react";
import { EventType } from "../store/store.model";
import { useAppState } from "../store";

const isNotDevelopment = (process.env.NODE_ENV !== "development") && (typeof window !== 'undefined');

const AppHead = () => {
    const selectedEvent: EventType = useAppState((state) => state.data.selectedEvent)
    const title = selectedEvent?.id ? `${selectedEvent?.title} - EPM Event` : "Eglise Paris Metropole - Évènements"
    return (
        <Head>
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
            <meta name="description" content={title} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://www.builda.dev/logo.png" />
            <meta property="og:description" content="Participés à des évènements que l'église organise." />
            <meta name="google-site-verification" content="t0DrQCo_DhHZsABPrynvdryLPkSjSowC_JQw6j3Tp_M" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@200;300;400;500;600;700;800;900&family=Urbanist:wght@800;900&display=swap" rel="stylesheet" />

            <link rel="icon" href="/favicon.ico" />
            {isNotDevelopment && (
            <>
                {/* Global Site Tag (gtag.js) - Google Analytics */}
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=G-6SVYFY541V`}
                />
                <script
                    dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-6SVYFY541V', {
                            page_path: window.location.pathname,
                        });
                        `,
                    }}
                />
                {/* Hotjar Tracking Code for www.builda.app */}
                <script
                    dangerouslySetInnerHTML={{
                    __html: `
                        (function(h,o,t,j,a,r){
                            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                            h._hjSettings={hjid:3156889,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                        `,
                    }}
                />
            </>
        )}
      </Head>
    )
}

export default AppHead
import Head from "next/head"
import { useStoreRehydrated } from 'easy-peasy'
import { useEffect } from "react";
import { AppsType } from "../store/store.model";
import { useAppState } from "../store";

const isNotDevelopment = (process.env.NODE_ENV !== "development") && (typeof window !== 'undefined');

const AppHead = () => {
    const selectedApp: AppsType = useAppState((state) => state.data.selectedApp)
    const title = selectedApp?.id ? `${selectedApp?.name} - ${selectedApp?.short_description}` : "Builda - Discover tomorrow's crypto apps, today."
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={title} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://www.builda.dev/logo.png" />
            <meta property="og:description" content="Builda is a community of early adopters and builders showcasing crypto related products and exchanging feedback." />
            <meta name="google-site-verification" content="t0DrQCo_DhHZsABPrynvdryLPkSjSowC_JQw6j3Tp_M" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Urbanist:ital,wght@0,500;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet" />

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
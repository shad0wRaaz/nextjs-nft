import Script from "next/script";
import { pageview } from "../utils/utilities";
import { useEffect } from "react";

export default function GoogleAnalytics(props){
    useEffect(() => {
        pageview(props.GA_MEASUREMENT_ID, window.location.href)
        console.log('changed', window.location.href)
    });

    return (
        <>
            <Script strategy="afterInteractive" 
                src={`https://www.googletagmanager.com/gtag/js?id=${props.GA_MEASUREMENT_ID}`}/>
            <Script id='google-analytics' strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });
                
                gtag('config', '${props.GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                });
                `,
                }}
            />
        </>
)}
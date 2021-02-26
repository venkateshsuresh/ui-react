import '../styles/globals.css';
import React from "react";
import Head from "next/head";
import {ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from "../components/Layout";
import theme from "../theme";

function MyApp({ Component, pageProps, router }) {

    React.useEffect(() => {
        // Remove the server-side injected CSS.

        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    //return <Component {...pageProps} />
    return (
        <React.Fragment>
            <Head>
                <title>Chaos Lab</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {
                    <Layout>
                        <Component {...pageProps}/>
                    </Layout>
                }
            </ThemeProvider>
        </React.Fragment>
    )
}

export default MyApp

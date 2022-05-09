import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=M+PLUS+Code+Latin:wght@200;300;400&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="bg-black font-sneakybird">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

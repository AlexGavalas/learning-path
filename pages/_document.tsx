import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
} from 'next/document';

const DESCRIPTION = 'Learn stuff about software development';
const TITLE = 'Learning Path';
const SITE_URL = 'https://learning-path.dev/';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="description" content={DESCRIPTION} />

                    <meta property="og:site_name" content={TITLE} />
                    <meta property="og:title" content={TITLE} />
                    <meta property="og:description" content={DESCRIPTION} />
                    <meta property="og:image" content="/images/spash.jpg" />
                    <meta property="og:url" content={SITE_URL} />

                    <meta
                        property="twitter:card"
                        content="summary_large_image"
                    />
                    <meta property="twitter:url" content={SITE_URL} />
                    <meta property="twitter:title" content={TITLE} />
                    <meta
                        property="twitter:description"
                        content={DESCRIPTION}
                    />
                    <meta
                        property="twitter:image"
                        content="/images/spash.jpg"
                    />
                </Head>
                <body className="bg-white dark:bg-[#121212]">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

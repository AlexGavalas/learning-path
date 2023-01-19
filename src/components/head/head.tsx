const DESCRIPTION = 'Learn stuff about software development';
const TITLE = 'Learning Path';
const SITE_URL = 'https://learning-path.dev/';

export const Head = () => {
    return (
        <>
            <link rel="icon" href="/favicons/favicon-32x32.png" sizes="any" />

            <link
                rel="icon"
                href="/favicons/favicon.svg"
                type="image/svg+xml"
            />

            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/favicons/apple-touch-icon.png"
            />

            <link rel="manifest" href="/manifest.json" />

            <meta name="description" content={DESCRIPTION} />

            <meta property="og:site_name" content={TITLE} />
            <meta property="og:title" content={TITLE} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:image" content="/images/spash.jpg" />
            <meta property="og:url" content={SITE_URL} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={SITE_URL} />
            <meta property="twitter:title" content={TITLE} />
            <meta property="twitter:description" content={DESCRIPTION} />
            <meta property="twitter:image" content="/images/spash.jpg" />

            <meta name="theme-color" content="#121212" />

            <link rel="canonical" href="https://learning-path.dev" />

            <link
                rel="search"
                type="application/opensearchdescription+xml"
                href="/opensearch.xml"
                title="Note search"
            />
        </>
    );
};
import type { GetServerSideProps } from 'next';

const OpenSearchXML = () => <></>;

// const getHost = ({ headers }) => {
//     return _get(headers, 'host');
// };

// const getProtocol = ({ headers }) => {
//     return _has(headers, 'x-forwarded-proto')
//         ? headers['x-forwarded-proto']
//         : _has(headers, 'referer')
//         ? headers.referer.split('://')[0]
//         : 'http';
// };

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    // const host = getHost(req);
    // const protocol = getProtocol(req);

    res.setHeader('Content-Type', 'application/xml');

    res.write(`<?xml version="1.0"?>
    <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
        <ShortName>Learning Path</ShortName>
        <Description>
            Description about your website search here
        </Description>
        <InputEncoding>UTF-8</InputEncoding>
        <Url type="text/html" template="http://localhost:3000?q={searchTerms}" />
    </OpenSearchDescription>
    `);

    res.end();

    return { props: {} };
};

export default OpenSearchXML;

import ReactMarkdown from 'react-markdown';

import { REHYPE_PLUGINS } from '~config/markdown';

export const Markdown = ({ content }: { content: string }): JSX.Element => (
    <ReactMarkdown rehypePlugins={REHYPE_PLUGINS}>{content}</ReactMarkdown>
);

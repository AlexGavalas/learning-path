import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark as style } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { REHYPE_PLUGINS } from '~config/markdown';

export const Markdown = ({ content }: { content: string }): JSX.Element => (
    <ReactMarkdown
        rehypePlugins={REHYPE_PLUGINS}
        components={{
            code({ node, inline, className = '', children, ...props }) {
                const language = /language-(\w+)/.exec(className)?.[1] ?? '';

                const lines = String(children).split('\n');

                if (lines.at(-1) === '') lines.pop();

                return language.length > 0 ? (
                    <SyntaxHighlighter
                        style={style}
                        language={language}
                        className={className}
                        showLineNumbers={true}
                    >
                        {lines.join('\n')}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
        }}
    >
        {content}
    </ReactMarkdown>
);

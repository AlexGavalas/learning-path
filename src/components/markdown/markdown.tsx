import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark as style } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { REHYPE_PLUGINS } from '~config/markdown';

export const Markdown = ({ content }: { content: string }): JSX.Element => (
    <ReactMarkdown
        rehypePlugins={REHYPE_PLUGINS}
        components={{
            code({ node, inline = false, className = '', children, ...props }) {
                const language = /language-(\w+)/.exec(className)?.[1] ?? '';

                const lines = String(children).split('\n');

                if (lines.at(-1) === '') lines.pop();

                const shouldHighlight = !inline && language.length > 0;

                return shouldHighlight ? (
                    <SyntaxHighlighter
                        style={style}
                        language={language}
                        className={className}
                        showLineNumbers={lines.length > 2}
                        customStyle={{ marginTop: 0, marginBottom: 0 }}
                    >
                        {lines.join('\n')}
                    </SyntaxHighlighter>
                ) : (
                    <span
                        className="rounded bg-slate-200 px-1 dark:bg-slate-700"
                        {...props}
                    >
                        {children}
                    </span>
                );
            },
        }}
    >
        {content}
    </ReactMarkdown>
);

import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../styles/theme.css';

export const articleContainer = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing.large,
    overflow: 'hidden',
    width: '100%',
});

export const banner = style({
    marginBottom: vars.spacing.medium,
});

export const backLink = style({
    display: 'inline-block',
    marginBottom: vars.spacing.large,
});

export const note = style({
    minWidth: '100%',
    hyphens: 'auto',
    textAlign: 'justify',
    color: vars.color.typography.primary,
});

globalStyle(`${note} :where(h1)`, {
    fontSize: '2em',
});

globalStyle(`${note} :where(h2)`, {
    fontSize: '1.5em',
});

globalStyle(`${note} :where(h1, h2, h3, h4, h5, h6)`, {
    color: vars.color.primary,
    fontWeight: 'bold',
    marginBottom: vars.spacing.large,
});

globalStyle(`${note} p`, {
    margin: `${vars.spacing.medium} 0`,
});

globalStyle(`${note} :where(h1, h2, h3, h4, h5, h6):has(a)`, {
    scrollMarginTop: vars.spacing.medium,
});

globalStyle(`${note} :where(h1, h2) a`, {
    color: vars.color.primary,
});

globalStyle(`${note} a`, {
    fontWeight: 500,
    textDecoration: 'underline',
    textDecorationColor: vars.color.primary,
    textDecorationThickness: '0.125rem',
    textUnderlineOffset: '0.125rem',
});

globalStyle(`${note} ul`, {
    marginBottom: vars.spacing.large,
});

globalStyle(`${note} li`, {
    listStyle: 'inside',
    margin: `${vars.spacing.small} 0`,
    paddingLeft: vars.spacing.small,
});

globalStyle(`${note} li::marker`, {
    color: vars.color.primary,
});

globalStyle(`${note} hr`, {
    borderColor: vars.color.border,
    margin: `${vars.spacing.large} 0`,
});

globalStyle(`${note} code`, {
    fontFamily: 'monospace',
    fontWeight: 600,
    fontSize: '0.875em',
});

globalStyle(`${note} code::before`, {
    content: '"`"',
});

globalStyle(`${note} code::after`, {
    content: '"`"',
});

globalStyle(`${note} pre`, {
    margin: `${vars.spacing.large} 0`,
    padding: vars.spacing.medium,
});

globalStyle(`${note} pre code::before`, {
    content: '',
});

globalStyle(`${note} pre code::after`, {
    content: '',
});

globalStyle(`${note} .line`, {
    counterIncrement: 'line',
});

globalStyle(`${note} .line::before`, {
    content: 'counter(line)',
    display: 'inline-block',
    width: '2em',
    userSelect: 'none',
    opacity: 0.3,
});

// TODO: markdown always has an extra line for code blocks for some reason
// globalStyle(`${note} .line:only-child::before`, {
//     content: '',
// });

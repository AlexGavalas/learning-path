import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../styles/theme.css';

export const articleContainer = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing.lg,
    overflow: 'hidden',
    width: '100%',
});

export const banner = style({
    marginBottom: vars.spacing.md,
});

export const backLink = style({
    display: 'inline-block',
    marginBottom: vars.spacing.lg,
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
    marginBottom: vars.spacing.lg,
});

globalStyle(`${note} p`, {
    margin: `${vars.spacing.md} 0`,
});

globalStyle(`${note} :where(h1, h2, h3, h4, h5, h6):has(a)`, {
    scrollMarginTop: vars.spacing.md,
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
    marginBottom: vars.spacing.lg,
});

globalStyle(`${note} li`, {
    listStyle: 'inside',
    margin: `${vars.spacing.sm} 0`,
    paddingLeft: vars.spacing.sm,
});

globalStyle(`${note} li::marker`, {
    color: vars.color.primary,
});

globalStyle(`${note} hr`, {
    borderColor: vars.color.border,
    margin: `${vars.spacing.lg} 0`,
});

globalStyle(`${note} code`, {
    fontFamily: 'monospace',
    fontSize: '0.875em',
    fontWeight: 400,
});

globalStyle(`${note} p code`, {
    fontWeight: 600,
});

globalStyle(`${note} code::before`, {
    content: '"`"',
});

globalStyle(`${note} code::after`, {
    content: '"`"',
});

globalStyle(`${note} pre`, {
    margin: `${vars.spacing.lg} 0`,
    padding: vars.spacing.md,
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

globalStyle(`${note} .line:last-child:empty`, {
    display: 'none',
});

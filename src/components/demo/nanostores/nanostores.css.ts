import { style } from '@vanilla-extract/css';

import { vars } from '../../../styles/theme.css';

export const demoContainer = style({
    width: '100%',
    minHeight: '520px',
    border: 'none',
});

export const noJSWarning = style({
    backgroundColor: vars.color.warning,
    padding: vars.spacing.md,
    borderRadius: vars.spacing.sm,
    color: vars.color.typography.warning,
});

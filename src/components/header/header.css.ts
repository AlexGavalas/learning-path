import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${vars.color.border}`,
});

export const logo = style({
    margin: `${vars.spacing.small} 0`,
    padding: vars.spacing.small,
    width: '30%',
    minWidth: '150px',
    borderRadius: '5px',
    ':hover': {
        backgroundColor: vars.color.backgroundHover,
    },
});

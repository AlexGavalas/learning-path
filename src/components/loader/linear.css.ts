import { keyframes, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

const backgroundSizeAnimation = keyframes({
    to: {
        backgroundSize: '100% 100%',
    },
});

export const loader = style({
    animation: `${backgroundSizeAnimation} 2s linear infinite alternate`,
    backgroundImage: `linear-gradient(to right, white 0%, ${vars.color.primary} 50%, white 100%)`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '25% 100%',
    height: '100%',
});

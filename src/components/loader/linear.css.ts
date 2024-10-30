import { style } from '@vanilla-extract/css';

import { fullSize } from '../../styles/animations.css';
import { vars } from '../../styles/theme.css';

const COLOR_STOPS = {
    START: `oklch(from ${vars.color.primary} 0.4 c h)`,
    END: `oklch(from ${vars.color.primary} 0.8 c h)`,
};

export const loader = style({
    animation: `${fullSize} 2s linear infinite alternate`,
    backgroundImage: `linear-gradient(to right, ${COLOR_STOPS.START}, ${COLOR_STOPS.END})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '25% 100%',
    height: '100%',
});

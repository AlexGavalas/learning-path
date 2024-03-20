import { style } from '@vanilla-extract/css';

import { fullSize } from '../../styles/animations.css';
import { vars } from '../../styles/theme.css';

export const loader = style({
    animation: `${fullSize} 2s linear infinite alternate`,
    backgroundImage: `linear-gradient(to right, white 0%, ${vars.color.primary} 50%, white 100%)`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '25% 100%',
    height: '100%',
});

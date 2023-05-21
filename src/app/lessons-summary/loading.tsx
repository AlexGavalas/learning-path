import { CicurlarLoader } from '~components/loader';

import { TITLE } from '../constants';

const Loading = () => (
    <div className="flex h-40 w-full items-center justify-center">
        <link rel="icon" href="/favicons/favicon-32x32.png" sizes="any" />
        <title>{TITLE}</title>
        <CicurlarLoader />
    </div>
);

export default Loading;

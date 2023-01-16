import Link from 'next/link';

const NotFound = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <p className="text-center">
                Looks like you reached a dead end ... Maybe try the path from
                the{' '}
                <Link href="/" replace={true}>
                    start
                </Link>
                ?
            </p>
        </div>
    );
};

export default NotFound;

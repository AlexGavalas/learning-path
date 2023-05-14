// TODO: Replace with <Link> component, does not seem to work at the momemnt

const NotFound = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <p className="text-center">
                Looks like you reached a dead end ... Maybe try the path from
                the <a href="/">start</a>?
            </p>
        </div>
    );
};

export default NotFound;

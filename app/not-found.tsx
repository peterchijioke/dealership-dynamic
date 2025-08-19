export default function NotFound() {
    return (
        <div className="h-screen flex flex-col relative pt-24 p-8 text-center">
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            <p className="mt-2 text-gray-600">
                The page you’re looking for doesn’t exist.
            </p>
        </div>
    );
}

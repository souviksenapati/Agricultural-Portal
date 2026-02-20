import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                404
            </h1>

            <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-gray-800">
                Page Not Found
            </h2>

            <p className="mt-3 text-gray-500 max-w-md text-sm sm:text-base">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>

            <Link
                to="/"
                className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base font-medium"
            >
                &#8592; Back to Home
            </Link>
        </div>
    )
}

export default NotFound
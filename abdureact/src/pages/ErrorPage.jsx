import { useRouteError, Link, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Router Error:', error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
        
        <div className="mb-6">
          <p className="text-lg mb-2">Something went wrong:</p>
          <p className="text-gray-700 font-mono bg-gray-100 p-2 rounded">
            {error.message || error.statusText || 'Unknown error'}
          </p>
          {error.status && (
            <p className="text-gray-500 mt-2">Status code: {error.status}</p>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Go Back
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
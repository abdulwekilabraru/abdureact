import { useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorPage from './ErrorPage';

const JobPage = ({ deleteJob }) => {
  const job = useLoaderData();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteJob(job.id);
      navigate('/jobs');
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <ErrorPage error={{ message: error }} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <div className="mb-4">
          <span className="text-gray-600">{job.company}</span>
          <span className="mx-2">•</span>
          <span className="text-gray-600">{job.location}</span>
        </div>
        <div className="mb-6">
          <p className="text-lg">{job.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-indigo-600 font-bold">{job.salary}</span>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const jobLoader = async ({ params }) => {
  try {
    const response = await fetch(`/api/jobs/${params.id}`);
    
    if (!response.ok) {
      throw new Response(null, {
        status: response.status,
        statusText: 'Job not found',
      });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Response(null, {
        status: 406,
        statusText: 'Invalid response format',
      });
    }

    const data = await response.json();
    
    if (!data.id) {
      throw new Response(null, {
        status: 404,
        statusText: 'Invalid job data',
      });
    }

    return data;
  } catch (error) {
    throw new Response(null, {
      status: 500,
      statusText: error.message || 'Failed to load job',
    });
  }
};

export default JobPage;
// src/components/Joblistings.jsx
import { useState, useEffect } from 'react';
import Joblisting from './Joblisting';

const Joblistings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        
        // Enhanced data validation
        const validatedJobs = data.map(job => ({
          id: job.id || '',
          title: job.title || 'Untitled Position',
          description: job.description || 'No description provided',
          company: job.company || 'Unknown Company',
          location: job.location || '',
          salary: job.salary || '',
          // Add other fields as needed
        }));
        
        setJobs(validatedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="text-center py-8">Loading jobs...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="job-listings grid gap-4">
      {jobs.length > 0 ? (
        jobs.map(job => <Joblisting key={job.id} {...job} />)
      ) : (
        <div className="text-center py-8 text-gray-500">
          No job listings available
        </div>
      )}
    </div>
  );
};

export default Joblistings;
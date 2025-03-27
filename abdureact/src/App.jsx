import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage from './pages/JobPage';
import { jobLoader } from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import ErrorPage from './pages/ErrorPage';

const App = () => {
  // Enhanced API handler with timeout and abort controller
  const apiRequest = async (url, method, data = null) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      };

      if (data) config.body = JSON.stringify(data);

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP error! Status: ${response.status}`);
      }

      if (response.status === 204) return null;
      
      // Validate JSON content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid content type');
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // API operations
  const addJob = (newJob) => apiRequest('/api/jobs', 'POST', newJob);
  const deleteJob = (id) => apiRequest(`/api/jobs/${id}`, 'DELETE');
  const updateJob = (job) => apiRequest(`/api/jobs/${job.id}`, 'PUT', job);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />} errorElement={<ErrorPage />}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route 
          path="/add-job" 
          element={<AddJobPage addJobSubmit={addJob} />} 
        />
        <Route
          path="/edit-job/:id"
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/jobs/:id"
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoader}
          errorElement={<ErrorPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    ),
    {
      basename: import.meta.env.BASE_URL, // For deployment subpaths
    }
  );

  return <RouterProvider router={router} />;
};

export default App;
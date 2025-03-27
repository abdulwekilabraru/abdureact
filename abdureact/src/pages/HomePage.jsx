import Hero from '../components/Hero';
import Homecards from '../components/Homecards';
import Joblistings from '../components/Joblistings';
import ViewAllJobs from '../components/ViewAllJobs';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Homecards />
      <Joblistings isHome={true} />
      <ViewAllJobs />
    </>
  );
};
export default HomePage;

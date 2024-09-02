import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminAddNews, AdminDashboard, AdminHome, AdminNews, AdminNewsDetails, AdminOpportunities, AdminPublications, AdminResearch, AdminResources, AdminTeam, Home, Login, News, NewsDetails, Opportunities, Publications, Research, Resources, StudentDashboard, Team, TeamMemberDetails } from './pages';
import { DAppBar, Footer, MessageDialog } from './components';
import ScrollToTop from './utils/scroll-to-top';

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <DAppBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/news' element={<News />} />
          <Route path='/news/:id' element={<NewsDetails />} />
          <Route path='/team' element={<Team />} />
          <Route path='/team/:id' element={<TeamMemberDetails />} />
          <Route path='/research' element={<Research />} />
          <Route path='/publications' element={<Publications />} />
          <Route path='/opportunities' element={<Opportunities />} />
          <Route path='/resources' element={<Resources />} />

          <Route path='/login' element={<Login />} />
          <Route path='/admin/:userId/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/:userId/news' element={<AdminNews />} />
          <Route path='/admin/:userId/news/:id' element={<AdminNewsDetails />} />
          <Route path='/admin/:userId/news/add-news' element={<AdminAddNews />} />
          <Route path='/admin/:userId/publications' element={<AdminPublications />} />
          <Route path='/admin/:userId/resources' element={<AdminResources />} />
          <Route path='/admin/:userId/team' element={<AdminTeam />} />
          <Route path='/admin/:userId/research' element={<AdminResearch />} />
          <Route path='/admin/:userId/opportunities' element={<AdminOpportunities />} />
          <Route path='/admin/:userId/home' element={<AdminHome />} />

          <Route path='/student/:userId/dashboard' element={<StudentDashboard />} />
        </Routes>
        <Footer />
      </Router>
      <MessageDialog />
    </div>
  );
}

export default App;

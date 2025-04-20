import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AttendeeDashboard from './pages/AttendeeDashboard';
import CreateEvent from './pages/CreateEvent';
import Tickets from './pages/Tickets';

const AppContainer = styled.div`
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#000')};
  color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  min-height: 100vh;
`;

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContainer theme={theme}>
      <Router>
        <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
        <Navbar theme={theme} />
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/signup" element={<Signup theme={theme} />} />
          <Route path="/organizer" element={<OrganizerDashboard theme={theme} />} />
          <Route path="/attendee" element={<AttendeeDashboard theme={theme} />} />
          <Route path="/create-event" element={<CreateEvent theme={theme} />} />
          <Route path="/tickets" element={<Tickets theme={theme} />} />
        </Routes>
        <Footer theme={theme} />
      </Router>
    </AppContainer>
  );
}

export default App;
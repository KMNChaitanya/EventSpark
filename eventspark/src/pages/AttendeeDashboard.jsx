import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Button = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  color: ${({ theme }) => (theme === 'light' ? '#fff' : '#000')};
  border-radius: 4px;
  text-decoration: none;
  &:hover {
    opacity: 0.9;
  }
`;

function AttendeeDashboard({ theme }) {
  return (
    <DashboardContainer>
      <Title>Attendee Dashboard</Title>
      <Button to="/tickets" theme={theme}>Browse Tickets</Button>
    </DashboardContainer>
  );
}

export default AttendeeDashboard;
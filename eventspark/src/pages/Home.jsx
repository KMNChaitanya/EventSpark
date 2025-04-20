import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const PrimaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  color: ${({ theme }) => (theme === 'light' ? '#fff' : '#000')};
  border-radius: 4px;
  text-decoration: none;
  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  border-radius: 4px;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => (theme === 'light' ? '#f0f0f0' : '#333')};
  }
`;

function Home({ theme }) {
  return (
    <HomeContainer>
      <Title>Welcome to EventSync</Title>
      <Description>Organize or attend events with ease using blockchain technology.</Description>
      <ButtonGroup>
        <PrimaryButton to="/signup" theme={theme}>Get Started</PrimaryButton>
        <SecondaryButton to="/tickets" theme={theme}>Browse Tickets</SecondaryButton>
      </ButtonGroup>
    </HomeContainer>
  );
}

export default Home;
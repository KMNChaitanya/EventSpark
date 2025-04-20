import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#333')};
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  &:hover {
    text-decoration: underline;
  }
`;

function Navbar({ theme }) {
  return (
    <Nav theme={theme}>
      <NavContainer>
        <Logo to="/" theme={theme}>EventSync</Logo>
        <NavLinks>
          <NavLink to="/" theme={theme}>Home</NavLink>
          <NavLink to="/tickets" theme={theme}>Tickets</NavLink>
          <NavLink to="/login" theme={theme}>Login</NavLink>
          <NavLink to="/signup" theme={theme}>Signup</NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}

export default Navbar;
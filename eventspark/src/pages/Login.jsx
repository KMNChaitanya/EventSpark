import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FormContainer = styled.div`
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#222')};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const RadioGroup = styled.div`
  margin-bottom: 1rem;
`;

const RadioLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#444')};
  border-radius: 4px;
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#333')};
  color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  color: ${({ theme }) => (theme === 'light' ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  a {
    color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 1rem;
`;

function Login({ theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Clean password to remove any unwanted backslashes
      const cleanedPassword = password.replace(/\\/g, '');
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: cleanedPassword,
      });
      localStorage.setItem('token', res.data.token);
      // Navigate based on role returned by backend
      navigate(res.data.user.role === 'organizer' ? '/organizer' : '/attendee');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <LoginContainer>
      <FormContainer theme={theme}>
        <Title>Login</Title>
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleLogin}>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="role"
                value="organizer"
                checked={role === 'organizer'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              Organizer
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="role"
                value="attendee"
                checked={role === 'attendee'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              Attendee
            </RadioLabel>
          </RadioGroup>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            theme={theme}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            theme={theme}
            required
          />
          <Button type="submit" theme={theme}>Login</Button>
        </form>
        <LinkText theme={theme}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </LinkText>
      </FormContainer>
    </LoginContainer>
  );
}

export default Login;
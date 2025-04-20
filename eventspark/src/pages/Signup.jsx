import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const SignupContainer = styled.div`
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

function Signup({ theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { email, password, role });
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
  };

  return (
    <SignupContainer>
      <FormContainer theme={theme}>
        <Title>Sign Up</Title>
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
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          theme={theme}
        />
        <Button onClick={handleSignup} theme={theme}>Sign Up</Button>
        <LinkText theme={theme}>
          Already have an account? <Link to="/login">Login</Link>
        </LinkText>
      </FormContainer>
    </SignupContainer>
  );
}

export default Signup;
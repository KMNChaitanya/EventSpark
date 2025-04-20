import styled from 'styled-components';

const ToggleButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: ${({ theme }) => (theme === 'light' ? '#ccc' : '#444')};
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

function ThemeToggle({ toggleTheme, theme }) {
  return (
    <ToggleButton onClick={toggleTheme} theme={theme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </ToggleButton>
  );
}

export default ThemeToggle;
import styled from 'styled-components';

const FooterStyled = styled.footer`
  padding: 1rem;
  text-align: center;
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#333')};
  margin-top: 2rem;
  border-top: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#444')};
`;

function Footer({ theme }) {
  return (
    <FooterStyled theme={theme}>
      <p>© 2025 EventSync. All rights reserved.</p>
    </FooterStyled>
  );
}

export default Footer;
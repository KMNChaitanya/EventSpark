import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ethers } from 'ethers';

const TicketContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#333')};
  color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
`;

const TicketItem = styled.div`
  border: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#555')};
  padding: 10px;
  margin: 10px 0;
`;

function Tickets({ theme }) {
  const [events, setEvents] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const FAKE_COIN_ADDRESS = '0x4E67259F93c17951602D5182898bd59675A4Cf15'; // Replace with your FakeCoin contract address from Remix

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No JWT token found in localStorage');
          alert('Please log in to view events.');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/events', {
          headers: { 'x-auth-token': token },
        });
        // Fetch organizer wallet for each event
        const eventsWithWallets = await Promise.all(
          res.data.map(async (event) => {
            try {
              console.log('Fetching organizer for event:', event._id, 'Organizer ID:', event.organizer);
              const userRes = await axios.get('http://localhost:5000/api/users/680e3f242fc50711ed7b6af6', {
                headers: { 'x-auth-token': token },
              });
              console.log('Organizer wallet:', userRes.data.walletAddress);
              console.log("hi");
              console.log(userRes.data.walletAddress);
              return { ...event, organizerWallet: userRes.data.walletAddress };
            } catch (err) {
              console.error(`Error fetching organizer for event ${event._id}:`, err.response?.data || err.message);
              return { ...event, organizerWallet: null };
            }
          })
        );
        setEvents(eventsWithWallets);
      } catch (err) {
        console.error('Error fetching events:', err.response?.data || err.message);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { 'x-auth-token': token },
          });
          setWalletAddress(res.data.walletAddress);
        } catch (err) {
          console.error('Error fetching user:', err.response?.data || err.message);
        }
      } else {
        console.error('No JWT token found for fetching user');
        alert('Please log in to load your wallet address.');
      }
    };

    fetchEvents();
    fetchUser();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return false;
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (err) {
      console.error('Wallet connection error:', err);
      if (err.code === -32002) {
        alert('MetaMask is processing another request. Please open MetaMask, unlock it, or complete the pending request.');
      } else {
        alert('Failed to connect MetaMask: ' + err.message);
      }
      return false;
    }
  };

  const buyTicket = async (eventId, price, organizerWallet) => {
    try {
      if (!organizerWallet) {
        alert('Organizer wallet not found for this event. Please contact support.');
        return;
      }

      const connected = await connectWallet();
      if (!connected) return;

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x14a34') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x14a34' }],
        });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        FAKE_COIN_ADDRESS,
        [
          'function balanceOf(address account) public view returns (uint256)',
          'function transfer(address to, uint256 amount) public returns (bool)',
        ],
        signer
      );
      const balance = await contract.balanceOf(userAddress);
      const priceInWei = ethers.parseUnits(price.toString(), 18);
      if (balance < priceInWei) {
        alert(`Not enough FAKE tokens! Need ${price} FAKE, but you have ${ethers.formatUnits(balance, 18)} FAKE`);
        return;
      }

      const tx = await contract.transfer(organizerWallet, priceInWei);
      const receipt = await tx.wait();
      console.log('Transaction hash:', receipt.hash);
      var hash = receipt.hash;

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/tickets/buy/${eventId}`,
        {},
        { headers: { 'x-auth-token': token } }
      );

      alert('Ticket purchased successfully!');
    } catch (err) {
      console.error('Purchase error:', err);
      if (err.code === -32002) {
        alert('MetaMask is processing another request. Please open MetaMask, unlock it, or complete the pending request.');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        alert('Not enough ETH for gas fees. Add Base Sepolia ETH to your wallet.');
      } else if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
        alert('Transaction failed. Check FakeCoin contract address or organizer wallet.');
      } else if (err.message.includes('user rejected')) {
        alert('You rejected the transaction in MetaMask.');
      } else {
        alert(`Purchased Ticket Successfully!!!\n Transaction hash:${hash}`);
      }
    }
  };

  return (
    <TicketContainer theme={theme}>
      <h2>Tickets for Sale</h2>
      <p>Wallet Address: {walletAddress || 'Loading...'}</p>
      {events.map((event) => (
        <TicketItem key={event._id} theme={theme}>
          <h3>{event.name}</h3>
          <p>{event.description}</p>
          <p>Price: {event.price} FAKE</p>
          {console.log(event)}
          <button onClick={() => buyTicket(event._id, event.price, walletAddress)}>
            Buy Ticket
          </button>
        </TicketItem>
      ))}
    </TicketContainer>
  );
}

export default Tickets;
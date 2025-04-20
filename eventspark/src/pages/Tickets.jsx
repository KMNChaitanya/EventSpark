import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const TicketsContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#444')};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#222')};
`;

const EventTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const EventDetail = styled.p`
  margin-bottom: 0.5rem;
`;

const BuyButton = styled.button`
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
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ResellButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #e53e3e;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

function Tickets({ theme }) {
  const [events, setEvents] = useState([]);
  const [ownedTickets, setOwnedTickets] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOwnedTickets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tickets/owned', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOwnedTickets(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
    fetchOwnedTickets();
  }, []);

  const handleBuy = async (eventId, price) => {
    try {
      await axios.post(
        'http://localhost:5000/api/tickets/buy',
        { eventId, price },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Ticket purchased successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to purchase ticket');
    }
  };

  const handleResell = async (ticketId, price) => {
    try {
      await axios.post(
        'http://localhost:5000/api/tickets/resell',
        { ticketId, price: price * 0.95 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Ticket listed for resale!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to list ticket for resale');
    }
  };

  return (
    <TicketsContainer>
      <Title>Tickets for Sale</Title>
      <EventGrid>
        {events.map((event) => (
          <EventCard key={event._id} theme={theme}>
            <EventTitle>{event.name}</EventTitle>
            <EventDetail>{event.description}</EventDetail>
            <EventDetail>Date: {event.date}</EventDetail>
            <EventDetail>Time: {event.time}</EventDetail>
            <EventDetail>Location: {event.location}</EventDetail>
            <EventDetail>Price: ${event.price}</EventDetail>
            <EventDetail>Tickets Available: {event.tickets}</EventDetail>
            <BuyButton
              onClick={() => handleBuy(event._id, event.price)}
              disabled={event.tickets === 0}
              theme={theme}
            >
              Buy Ticket
            </BuyButton>
          </EventCard>
        ))}
      </EventGrid>

      <Title style={{ marginTop: '3rem' }}>Your Tickets</Title>
      <EventGrid>
        {ownedTickets.map((ticket) => (
          <EventCard key={ticket._id} theme={theme}>
            <EventTitle>{ticket.event.name}</EventTitle>
            <EventDetail>Price: ${ticket.price}</EventDetail>
            <ResellButton onClick={() => handleResell(ticket._id, ticket.price)}>
              Resell Ticket
            </ResellButton>
          </EventCard>
        ))}
      </EventGrid>
    </TicketsContainer>
  );
}

export default Tickets;
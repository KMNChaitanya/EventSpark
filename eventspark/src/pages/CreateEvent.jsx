import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const CreateEventContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#444')};
  border-radius: 4px;
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#333')};
  color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
  resize: vertical;
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

function CreateEvent({ theme }) {
  const [event, setEvent] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    contact: '',
    location: '',
    tickets: 0,
    price: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events', event, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Event created successfully!');
      navigate('/organizer');
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    }
  };

  return (
    <CreateEventContainer>
      <Title>Create Event</Title>
      <FormContainer>
        <Input
          type="text"
          name="name"
          placeholder="Event Name"
          value={event.name}
          onChange={handleChange}
          theme={theme}
        />
        <Textarea
          name="description"
          placeholder="Event Description"
          value={event.description}
          onChange={handleChange}
          theme={theme}
        />
        <Input
          type="date"
          name="date"
          value={event.date}
          onChange={handleChange}
          theme={theme}
        />
        <Input
          type="time"
          name="time"
          value={event.time}
          onChange={handleChange}
          theme={theme}
        />
        <Input
          type="text"
          name="contact"
          placeholder="Contact Details"
          value={event.contact}
          onChange={handleChange}
          theme={theme}
        />
        <Input
          type="text"
          name="location"
          placeholder="Location"
          value={event.location}
          onChange={handleChange}
          theme={theme}
        />
        <Input
          type="number"
          name="tickets"
          placeholder="Number of Tickets"
          value={event.tickets}
          onChange={handleChange}
          theme={theme}
        />
        <Input
          type="number"
          name="price"
          placeholder="Ticket Price"
          value={event.price}
          onChange={handleChange}
          theme={theme}
        />
        <Button onClick={handleSubmit} theme={theme}>Create Event</Button>
      </FormContainer>
    </CreateEventContainer>
  );
}

export default CreateEvent;
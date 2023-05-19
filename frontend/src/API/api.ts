import axios from "axios";

const API_URL = "http://localhost:5000";

interface Event {
  id: string;
  title: string;
  date: string;
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await axios.get<Event[]>(`${API_URL}/events`);
  return response.data;
};

export const createEvent = async (newEvent: Event): Promise<void> => {
  await axios.post(`${API_URL}/events`, newEvent);
};

export const deleteEvent = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/events/${id}`);
};

export const updateEvent = async (updatedEvent: Event): Promise<void> => {
  await axios.put(`${API_URL}/events/${updatedEvent.id}`, updatedEvent);
};
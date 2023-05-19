import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import { getEvents, createEvent, deleteEvent, updateEvent } from "./API/api";

interface Event {
  id: string;
  title: string;
  date: string;
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getEvents();
      setEvents(events);
    };

    fetchEvents();
  }, []);

  const handleDateSelect = (arg: DateSelectArg) => {
    setSelectedDate(arg.startStr);
    setActionModalOpen(true);
    setSelectedEvent(null); // Обнуляем selectedEvent при выборе новой даты
  };

  const handleEventClick = (arg: EventClickArg) => {
    setSelectedEvent({
      id: arg.event.id,
      title: arg.event.title,
      date: arg.event.start?.toISOString() || "",
    });
    setActionModalOpen(true);
  };

  const handleCreateEvent = async () => {
    if (title) {
      const newEvent: Event = {
        title,
        date: selectedDate,
        id: Math.random().toString(),
      };
      setEvents([...events, newEvent]);

      await createEvent(newEvent);
    }

    setTitle("");
    setModalOpen(false);
    setActionModalOpen(false);
  };

  const handleUpdateEvent = async () => {
    if (title && selectedEvent) {
      const updatedEvent: Event = { ...selectedEvent, title };
      setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));

      await updateEvent(updatedEvent);
    }

    setTitle("");
    setModalOpen(false);
    setActionModalOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));

      await deleteEvent(selectedEvent.id);
      setSelectedEvent(null); // Обнуляем selectedEvent после удаления
    }

    setModalOpen(false);
    setActionModalOpen(false);
  };

  const handleViewEvent = () => {
    if (selectedEvent) {
      setModalOpen(true);
    }
  };

  return (
    <div className="Calendar" style={{ width: "500px", margin: "0 auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        selectable={true}
        firstDay={1}
        locale="ru"
        buttonText={{
          today: "Сегодня",
        }}
      />

      <Modal
        isOpen={actionModalOpen}
        onRequestClose={() => setActionModalOpen(false)}
        contentLabel="Event Actions"
      >
        <h2>Выберите действие</h2>
        <button onClick={() => setModalOpen(true)}>Добавить событие</button>
        {selectedEvent && (
          <>
            <button onClick={handleViewEvent}>Просмотреть событие</button>
            <button onClick={() => setModalOpen(true)}>Редактировать событие</button>
            <button onClick={handleDeleteEvent}>Удалить событие</button>
          </>
        )}
      </Modal>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Edit Event"
      >
        <h2>{selectedEvent ? "Редактировать событие" : "Добавить событие"}</h2>
        {selectedEvent && (
          <div>
            <h3>{selectedEvent.title}</h3>
            <p>Дата: {selectedEvent.date}</p>
          </div>
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название события"
        />
        <button onClick={selectedEvent ? handleUpdateEvent : handleCreateEvent}>
          {selectedEvent ? "Обновить" : "Добавить"}
        </button>
      </Modal>
    </div>
  );
};

export default Calendar;
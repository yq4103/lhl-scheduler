import axios from "axios";
import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import "components/Application.scss";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

// const appointments = {
//   1: {
//     id: 1,
//     time: "12pm",
//   },
//   2: {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 3,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       },
//     },
//   },
//   3: {
//     id: 3,
//     time: "2pm",
//   },
//   4: {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Archie Andrews",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       },
//     },
//   },
//   5: {
//     id: 5,
//     time: "4pm",
//   },
// };

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const interviewers = getInterviewersForDay(state, state.day);

  const setDay = (day) => setState({ ...state, day });

  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  function updateSpots(days, apptId, appointments) {
    const findDay = (day) => day.appointments.includes(apptId);
    const singleDay = days.find(findDay);
    let nullAppointments = 0;
    singleDay.appointments.forEach((id) => {
      if (appointments[id].interview === null) {
        nullAppointments++;
      }
    });
    singleDay.spots = nullAppointments;
    return singleDay;
  }

  function bookInterview(id, interview) {
    const appointmentToSave = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    return new Promise((resolve, reject) => {
      //taking the current state, getting all the appointments, and adding the appointment we just saved to the database, updating local state to match the server
      //take the appointments object, saving the interview to the current state, updating the state of appointments
      axios
        .put(`/api/appointments/${id}`, appointmentToSave)

        .then(() => {
          const appointments = {
            ...state.appointments,
            [id]: appointmentToSave,
          };

          setState({
            ...state,
            appointments,
          });

          const newDay = updateSpots(state.days, id, appointments);

          const daysArray = [...state.days];

          daysArray[newDay.id - 1] = newDay;

          setState((prev) => ({
            ...prev,
            days: daysArray,
          }));

          resolve("success");
        })

        .catch((err) => {
          reject(err);
        });
    });
  }

  function cancelInterview(id) {
    const appointmentToCancel = {
      ...state.appointments[id],
      interview: null,
    };

    return new Promise((resolve, reject) => {
      //taking the current state, getting all the appointments, and removing the appointment from the database
      //take the appointments, saving the interview to the current state, updating the state of appointments
      axios
        .delete(`/api/appointments/${id}`, appointmentToCancel)

        .then(() => {
          const appointments = {
            ...state.appointments,
            [id]: appointmentToCancel,
          };

          setState({
            ...state,
            appointments,
          });

          const newDay = updateSpots(state.days, id, appointments);

          const daysArray = [...state.days];

          daysArray[newDay.id - 1] = newDay;

          setState((prev) => ({
            ...prev,
            days: daysArray,
          }));

          resolve("success");
        })

        .catch((err) => {
          reject(err);
        });
    });
  }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

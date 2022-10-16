export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const result = [];

  const filteredDay = state.days.find((apptDay) => apptDay.name === day);

  if (!filteredDay) {
    return result;
  }

  for (let appId of filteredDay.appointments) {
    result.push(state.appointments[appId]);
  }

  return result;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewer = state.interviewers[interview.interviewer];

  return { ...interview, interviewer };
}

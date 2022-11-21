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

export function getInterviewersForDay(state, day) {
  //to find within the days array the object with a name key whose value equals the day specified
  //the value of the interviewers key of the days object is an array of interviewers ids, iterate through the array and push the corresponding interviewers object to the result array
  const result = [];

  const filteredDay = state.days.find((apptDay) => apptDay.name === day);

  if (!filteredDay) {
    return result;
  }

  for (let apptId of filteredDay.interviewers) {
    result.push(state.interviewers[apptId]);
  }

  return result;
}

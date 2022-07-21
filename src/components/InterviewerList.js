import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

const InterviewerList = (props) => {
  const interviewers = props.interviewers;
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map((item) => {
          const { id, name, avatar } = item;
          return (
            <InterviewerListItem
              key={id}
              id={id}
              name={name}
              avatar={avatar}
              selected={id === props.interviewer}
              setInterviewer={props.setInterviewer}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default InterviewerList;

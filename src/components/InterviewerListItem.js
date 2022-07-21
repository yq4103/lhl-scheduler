import React from "react";
import "components/InterviewerListItem.scss";
import classNames from "classnames";

const InterviewerListItem = (props) => {
  const interviewerListClass = classNames(
    props.selected ? "interviewers__item--selected" : "interviewers__item"
  );

  return (
    <li
      className={interviewerListClass}
      onClick={() => props.setInterviewer(props.id)}
    >
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected ? props.name : null}
    </li>
  );
};

export default InterviewerListItem;

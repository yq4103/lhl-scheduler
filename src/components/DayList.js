import React from "react";
import DayListItem from "./DayListItem";

const DayList = (props) => {
  const days = props.days;
  return (
    <ul>
      {days.map((item) => {
        const { id, name, spots } = item;
        return (
          <DayListItem
            key={id}
            name={name}
            spots={spots}
            selected={name === props.value}
            setDay={props.onChange}
          />
        );
      })}
    </ul>
  );
};

export default DayList;

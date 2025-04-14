import React from "react";
import GenericTab from "./GenericTab";
import PropTypes from "prop-types";

const TabsGroup = ({ tabs, selected, onSelect }) => {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      {tabs.map((tab) => (
        <GenericTab
          key={tab}
          label={tab}
          isSelected={selected === tab}
          onClick={() => onSelect(tab)}
        />
      ))}
    </div>
  );
};

TabsGroup.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TabsGroup;

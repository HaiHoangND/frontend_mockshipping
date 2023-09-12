import React from "react";
import "./searchbar.scss";
import { Search } from "@mui/icons-material";

export const Searchbar = ({ onInputChange, placeholderText }) => {
  const handleInputChange = (e) => {
    onInputChange(e.target.value);
  };
  return (
    <div className="searchbarContainer">
      <Search />
      <input
        type="text"
        placeholder={placeholderText}
        onChange={handleInputChange}
      />
    </div>
  );
};

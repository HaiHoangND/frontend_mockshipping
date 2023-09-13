import { Input, Space } from "antd";
import React from "react";
import "./searchbar.scss";

const { Search } = Input;
export const Searchbar = ({ onInputChange, placeholderText }) => {
  const onSearch = (value, _e, info) => onInputChange(value);
  return (
    <Space>
      <Search
        placeholder="Mã vận đơn"
        onSearch={onSearch}
        style={{
          width: 200,
        }}
      />
    </Space>
  );
};

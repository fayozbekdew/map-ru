import React, { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

function Header({ setSearchEl, setPlaces, places, data, setSearchLocation }) {
  const navigate = useNavigate();
  function selectStatus(stat) {
    if (stat === "все") {
      setPlaces(data);
      return;
    }
    const status = data.filter((obg) => obg.category === stat);
    setPlaces(status);
  }
  return (
    <div className="w-[1300px] absolute z-10  mt-4 max-w-full mx-auto flex items-start justify-center gap-x-2">
      <Input
        places={places}
        placeholder="Поиск по кадастровому номеру"
        type="text"
        width="1000px"
        height="50px"
        setSearchEl={setSearchEl}
      />
      <select
        onChange={(e) => selectStatus(e.target.value)}
        className="bg-gray-200 text-black border border-black pl-1  w-[100px] h-[50px] rounded-md flex items-center justify-center"
      >
        <option defaultChecked value="все">
          Все
        </option>
        <option value="промышленности">Земли промышленности </option>
        <option value="поселений">земли поселений</option>
        <option value="сельскохозяйственного">
          земли сельскохозяйственного назначения{" "}
        </option>
      </select>
      <button
        onClick={() => navigate("/add")}
        className="bg-gray-200 text-black border border-black pl-1  w-[100px] h-[50px] rounded-md flex items-center justify-center"
      >
        новый объект
      </button>
    </div>
  );
}

export default Header;

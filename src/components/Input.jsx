import React, { useState } from "react";

function Input({ placeholder, type, label, img, width, height, setSearchEl, places }) {
  const [filteredList, setFilteredList] = useState([]);
  function filteredFn(kadastreNumber) {
    if (kadastreNumber != "") {
      setSearchEl([])
        const newData = places.filter((obg) =>
        obg.kadastreNumber.includes(kadastreNumber)
      );
      setFilteredList(newData);
    } else {
      setSearchEl([]);
      setFilteredList([]);
    }
  }
  if (label != null) {
    return (
      <label className={` relative flex items-start flex-col gap-y-1`}>
        <h3> {label}</h3>
        {img != null && (
          <img
            src={img}
            width="40px"
            height="40px"
            alt="input img"
            className="absolute "
          />
        )}
        <input
          onChange={(e) => filteredFn(e.target.value)}
          className={`max-w-full w-[${width}] h-[${height}] border border-black`}
          type={type}
          placeholder={placeholder}
        />
      </label>
    );
  } else {
    return (
      <div className={` relative flex  flex-col gap-y-1`}>
        {img != null && (
          <img
            src={img}
            width="40px"
            height="40px"
            alt="input img"
            className="absolute left-0 "
          />
        )}
        <input
          onChange={(e) => filteredFn(e.target.value)}
          className={`max-w-full w-[1000px] h-[${height}]  rounded-md pl-3 text-[20px] outline-none border border-black backdrop-blur-sm bg-white/30`}
          type={type}
          placeholder={placeholder}
        />
        {/* bg-white/30 */}
        {filteredList.length > 0 && (
          <ul className="bg-white/30 backdrop-blur-sm border-2 border-gray-400">
            {filteredList.map((obj) => (
              <li
                onClick={() => {
                  setSearchEl([obj]), setFilteredList([]);
                }}
                key={crypto.randomUUID()}
                className="border-b-2 border-gray-400 py-1 pl-4 hover:cursor-pointer "
              >
                {obj.kadastreNumber}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Input;

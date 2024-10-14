import React, { useState } from "react";
import Input from "../components/Input";
import Modal from "react-modal";
import { CloseBtn } from "../assets";
import { useEffect } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
Modal.setAppElement("#root");

function Header({ setSearchEl, setPlaces, places, data, pass }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  if (otp.length === 6 && otp === pass) {
    navigate("/add");
  } else if (otp.length === 6 && otp !== pass) {
  }
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
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
        onClick={() => openModal()}
        className="bg-gray-200 text-black border border-black pl-1  w-[100px] h-[50px] rounded-md flex items-center justify-center"
      >
        новый объект
      </button>
      <Modal
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "300px",
            backgroundColor: "gray",
            borderRadius: "10px",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Modal fon rangini o'zgartirish
            zIndex: "9999",
          },
        }}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span></span>}
          renderInput={(props) => <input className="" {...props} />}
          inputStyle="!w-[50px] h-[50px] mx-2 border-2 border-gray-300 rounded-md text-center text-lg"
        />
        <p
          className={`${
            otp.length === 6 && otp !== pass ? "block" : "hidden"
          } text-red-500 absolute bottom-10 text-[20px] font-semibold`}
        >
          Код ошибки{" "}
        </p>
        <button onClick={closeModal}>
          <img
            src={CloseBtn}
            width="20px"
            height="20px"
            className="absolute top-2 right-2"
          />
        </button>
      </Modal>
    </div>
  );
}

export default Header;

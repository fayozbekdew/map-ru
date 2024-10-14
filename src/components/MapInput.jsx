import React, { useState } from "react";
import Modal from "react-modal";
import { YMaps, Map, Placemark, TypeSelector } from "react-yandex-maps";

// Modalni qo'llab-quvvatlash uchun ID belgilash
Modal.setAppElement("#root");

function MapInput({koordinate}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null); // Tanlangan koordinata
  const [inputValue, setInputValue] = useState(""); // Input uchun qiymat
  const [zoomLevel, setZoomLevel] = useState(10); // Zoom darajasi
  const [center, setCenter] = useState([55.751574, 37.573856]);
  // Xarita bosilganda
  const handleMapClick = (event) => {
    const coords = event.get("coords");
    setSelectedCoordinates(coords); // Yangi koordinatni saqlash
  };

  // Modal yopilganda
  const handleCloseModal = () => {
    if (selectedCoordinates) {
      // Tanlangan koordinatalarni inputga yozish
      const coordsString = `${selectedCoordinates[0].toFixed(5)}, ${selectedCoordinates[1].toFixed(5)}`;
      setInputValue(coordsString);
    }
    setModalIsOpen(false);
  };

  // Zoom oshirish
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 1, 18)); // Zoom 18 dan oshmasligi kerak
  };

  // Zoom kamaytirish
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 1, 1)); // Zoom 1 dan past bo'lmasligi kerak
  };

  return (
    <div>
      <label className="flex flex-col gap-y-1 text-[20px]">
        Адрес доставки
        <input
          ref={koordinate}
          className="map-input pl-2"
          type="text"
          value={inputValue}
          onClick={() => setModalIsOpen(true)} // Modalni ochish
          readOnly 
        />
      </label>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Select Coordinates"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            height: "500px",
            padding: "0",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Modal fon rangini o'zgartirish
            zIndex: "9999",
          },
        }}
      >
        {selectedCoordinates && (
          <p className="text-[20px] text-center border w-[350px] backdrop-blur-sm bg-white/30 absolute top-[20px] left-[50%] translate-x-[-50%] z-20">
            Koordinatalar: {selectedCoordinates[0].toFixed(5)}, {selectedCoordinates[1].toFixed(5)}
          </p>
        )}
        
        <YMaps>
          <Map
            state={{ center: center, zoom: zoomLevel }} // Zoom darajasini qo'shamiz
            onClick={handleMapClick}
            style={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: "default", // Standart zoom control'ni o'chirib qo'ying
            }}
          >
            <Placemark coordinates={center} options={{ preset: 'islands#icon', iconColor: '#0095b6' }} />
            {selectedCoordinates && (
              <Placemark 
                coordinates={selectedCoordinates} 
                options={{ preset: 'islands#icon', iconColor: '#ff0000' }} // Markerni o'z rangini belgilash
              />
            )}
            <TypeSelector options={{ float: "right" }} />
          </Map>
        </YMaps>
        <div className="inline-flex flex-col gap-y-1 absolute top-[50%] right-[20px] translate-y-[-50%]">
          <button
            className="bg-[#c8c8ce] px-2 text-[20px] flex items-center justify-center rounded-sm"
            onClick={handleZoomIn}
          >
            +
          </button>
          <button
            className="bg-[#c8c8ce] px-2 text-[20px] flex items-center justify-center rounded-sm"
            onClick={handleZoomOut}
          >
            -
          </button>
        </div>
        
        <button
          className="bg-[#8e8edb] px-2 text-[20px] flex items-center justify-center rounded-sm absolute bottom-[20px] right-[50%] translate-x-[50%]"
          onClick={handleCloseModal}
        >
          Saqlash
        </button>
      </Modal>
    </div>
  );
}

export default MapInput;

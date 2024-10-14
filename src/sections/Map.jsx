import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark, TypeSelector } from "react-yandex-maps";
import { CloseBtn, Marker, SearchImg, StoryImg } from "../assets";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MapEl = ({ searchEl, setSearchEl,places }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState([55.751574, 37.573856]);
  // Obyektlar ma'lumotlari (taxminiy 5 ta obyekt)
  
  const [zoom, setZoom] = useState(10);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 1, 18)); // Maksimal zoom darajasi 18
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 1, 0)); // Minimal zoom darajasi 0
  };

  const openModal = (place) => {
    setSelectedPlace(place);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPlace(null);
  };
  useEffect(() => {
    // Foydalanuvchining joylashuvini aniqlash
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setCenter([latitude, longitude])
      },
      (error) => {
        console.error("Geolocation xatoligi:", error);
      }
    );
  }, []);
  // Yangi obyektlarni API'dan olish (simulatsiya qilinmoqda)
  useEffect(() => {
    // Bu yerda siz obyektlarni API orqali dinamik ravishda olasiz
    // Masalan: fetch('/api/objects').then((response) => setPlaces(response.data));
  }, []);
  return (
    <YMaps query={{ apikey: "59877cbf-2654-4cfc-b2bc-626e1807065f" }}>
      {searchEl.length > 0 ? (
        <div className="flex flex-col rounded-md text-white p-2 w-[330px] max-w-full h-[85%] absolute left-3 bottom-3 z-10 bg-[#548de7]">
          <button onClick={() => setSearchEl([])}>
            <img
              src={CloseBtn}
              width="20px"
              height={"20px"}
              className="absolute top-2 right-2"
            />
          </button>
          <h1 className="mx-auto text-white text-[20px] font-bold">
            About Object
          </h1>
          <h2 className="text-center font-bold text-[18px] pb-2 ">Земельный участок: {searchEl[0]?.kadastreNumber}</h2>
        <hr />
        <div className="flex flex-col gap-y-2 mt-2">
        <span className="font-bold flex items-center gap-x-2">Тип: <p className="font-normal">{searchEl[0]?.type}</p></span>
        <span className="font-bold flex items-center gap-x-2">Кадастровый номер:  <p className="font-normal">{searchEl[0]?.kadastreNumber}</p></span>
        <span className="font-bold flex items-center gap-x-2">Кадастровый квартал: <p className="font-normal">{searchEl[0]?.kadastreKvartal}</p></span>
        <span className="font-bold flex items-center gap-x-2">Адрес: <p className="font-normal">{searchEl[0]?.adress}</p></span>
        <span className="font-bold flex items-center gap-x-2">Площадь уточненная: <p className="font-normal">{searchEl[0]?.areaAdjusted}</p></span>
        <span className="font-bold flex items-center gap-x-2">Статус: <p className="font-normal">{searchEl[0]?.status}</p></span>
        <span className="font-bold flex items-center gap-x-2">Категория земель: <p className="font-normal">{searchEl[0]?.category}</p></span>
        <span className="font-bold flex items-center gap-x-2">Разрешенное использование: <p className="font-normal">{searchEl[0]?.useArea}</p></span>
        <span className="font-bold flex items-center gap-x-2">Форма собственности: <p className="font-normal">{searchEl[0]?.ownership}</p></span>
        <span className="font-bold flex items-center gap-x-2">Кадастровая стоимость: <p className="font-normal">{searchEl[0]?.kadasteValue}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата определения: <p className="font-normal">{searchEl[0]?.dateDetermination}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата утверждения: <p className="font-normal">{searchEl[0]?.approvaDate}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата внесения сведений: <p className="font-normal">{searchEl[0]?.enteringDate}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата применения: <p className="font-normal">{searchEl[0]?.dateApplication}</p></span>
        </div>
        </div>
      ) : null}
      <Map
        state={{ center: center, zoom: zoom }}
        className="w-full h-full"
        options={{
            searchControl: 'none',
            zoomControl: 'default', // Standart zoom control'ni o'chirib qo'ying
          }}
      >
        {userLocation && (
          <Placemark
            geometry={userLocation} // Foydalanuvchining joylashuvi
            properties={{ balloonContent: "Sizning joylashuvingiz" }}
            options={{
              iconLayout: "default#image",
              iconImageHref:
                "https://img.icons8.com/ios-filled/50/000000/marker.png", // Marker rasmi
              iconImageSize: [20, 20],
              iconImageOffset: [-15, -15],
            }}
          />
        )}
        {places.map((place) => (
          <Placemark
            onClick={() => openModal(place)}
            key={place.id}
            geometry={place.koordinates}
            properties={{ balloonContent: place.type }}
            options={{
              iconLayout: "default#image",
              iconImageHref: Marker, // Bu yerda obyektning maxsus rasmini joylashtiramiz
              iconImageSize: [30, 42], // Rasmning o'lchami (o'zingiz moslashtirishingiz mumkin)
              iconImageOffset: [-15, -42], // Marker pozitsiyasi (sozlash uchun)
            }}
          />
        ))}
        <TypeSelector options={{ float: "right" }} />
      </Map>
      <div className="zoom-buttons">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
      </div>
      {/* Modal */}
      <Modal
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "500px",
            padding: "20px 20px 20px 20px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Modal fon rangini o'zgartirish
            zIndex: "9999",
          },
        }}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        {/* <img src={selectedPlace?.img} className="w-full h-[150px]" alt="" /> */}
        <h2 className="text-center font-bold text-[18px] pb-2 ">Земельный участок: {selectedPlace?.kadastreNumber}</h2>
        <hr />
        <div className="flex flex-col gap-y-2 mt-2">
        <span className="font-bold flex items-center gap-x-2">Тип: <p className="font-normal">{selectedPlace?.type}</p></span>
        <span className="font-bold flex items-center gap-x-2">Кадастровый номер:  <p className="font-normal">{selectedPlace?.kadastreNumber}</p></span>
        <span className="font-bold flex items-center gap-x-2">Кадастровый квартал: <p className="font-normal">{selectedPlace?.kadastreKvartal}</p></span>
        <span className="font-bold flex items-center gap-x-2">Адрес: <p className="font-normal">{selectedPlace?.adress}</p></span>
        <span className="font-bold flex items-center gap-x-2">Площадь уточненная: <p className="font-normal">{selectedPlace?.areaAdjusted}</p></span>
        <span className="font-bold flex items-center gap-x-2">Статус: <p className="font-normal">{selectedPlace?.status}</p></span>
        <span className="font-bold flex items-center gap-x-2">Категория земель: <p className="font-normal">{selectedPlace?.category}</p></span>
        <span className="font-bold flex items-center gap-x-2">Разрешенное использование: <p className="font-normal">{selectedPlace?.useArea}</p></span>
        <span className="font-bold flex items-center gap-x-2">Форма собственности: <p className="font-normal">{selectedPlace?.ownership}</p></span>
        <span className="font-bold flex items-center gap-x-2">Кадастровая стоимость: <p className="font-normal">{selectedPlace?.kadasteValue}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата определения: <p className="font-normal">{selectedPlace?.dateDetermination}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата утверждения: <p className="font-normal">{selectedPlace?.approvaDate}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата внесения сведений: <p className="font-normal">{selectedPlace?.enteringDate}</p></span>
        <span className="font-bold flex items-center gap-x-2">дата применения: <p className="font-normal">{selectedPlace?.dateApplication}</p></span>
        </div>
        <button onClick={closeModal}>
          <img
            src={CloseBtn}
            width="20px"
            height={"20px"}
            className="absolute top-2 right-2"
          />
        </button>
      </Modal>
    </YMaps>
  );
};

export default MapEl;

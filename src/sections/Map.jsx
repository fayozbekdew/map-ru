import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark, TypeSelector } from "react-yandex-maps";
import { CloseBtn, Marker, MarkerSearch, SearchImg, StoryImg } from "../assets";
import Modal from "react-modal";
import { MapContext } from "../contex/contex";
import { useContext } from "react";

Modal.setAppElement("#root");

const MapEl = ({ searchEl, setSearchEl, places }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState([55.751574, 37.573856]);
  const { searchLocationEl, searchLocation } = useContext(MapContext);
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
        setCenter([latitude, longitude]);
      },
      (error) => {
        console.error("Geolocation xatoligi:", error);
      }
    );
  }, []);
  useEffect(() => {
    if (searchLocationEl != null) {
      setCenter(searchLocationEl?.koordinates);
      setZoom(15);
    }
    console.log(111);
  }, [searchLocationEl]);
console.log(searchLocationEl);
  return (
    <YMaps query={{ apikey: "59877cbf-2654-4cfc-b2bc-626e1807065f" }}>
      {searchLocationEl !== null ? (
        <div className="flex flex-col rounded-md text-white p-2 w-[330px] max-w-full h-[85%] absolute left-3 bottom-3 z-10 bg-[#548de7]">
          <button
            onClick={() => {
              searchLocation(null);
              setZoom(10)
              setCenter([55.751574, 37.573856])
            }}
          >
            <img
              src={CloseBtn}
              width="20px"
              height={"20px"}
              className="absolute top-2 right-2"
            />
          </button>
          <h2 className="text-center font-bold text-[18px] pb-2 ">
            Земельный участок: {searchLocationEl?.kadastreNumber}
          </h2>
          <hr />
          <div className="flex flex-col gap-y-2 mt-2">
            <span className="font-bold flex items-center gap-x-2">
              Кадастровый номер:{" "}
              <p className="font-normal">{searchLocationEl?.kadastreNumber}</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
              Кадастровый квартал:{" "}
              <p className="font-normal">{searchLocationEl?.data?.gkn?.objectData?.parentCadNum}</p>
            </span>
            <span className="font-bold flex items-start gap-x-2">
              Адрес: <p className="font-normal">{searchLocationEl?.data?.gkn?.objectData?.objectAddress}</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
            Площадь декларированная:{" "}
              <p className="font-normal">{searchLocationEl?.data?.egrp?.parcelData.areaValue} km2</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
              Категория земель:{" "}
              <p className="font-normal">{searchLocationEl?.data?.egrp.parcelData.categoryTypeValue}</p>
            </span>
            <span className="font-bold flex items-start gap-x-2">
              Разрешенное использование:{" "}
              <p className="font-normal">{searchLocationEl?.data?.egrp.parcelData.utilByDoc}</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
              Кадастровая стоимость:{" "}
              <p className="font-normal">{
              new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
              searchLocationEl?.data?.gkn.objectData.parcelData.cadCostValue,
              )
              }</p>
            </span>
          </div>
        </div>
      ) : null}
      <Map
        state={{ center: center, zoom: zoom }}
        className="w-full h-full"
        options={{
          searchControl: "none",
          zoomControl: "default", // Standart zoom control'ni o'chirib qo'ying
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
        {searchLocationEl && (
          <Placemark
            geometry={searchLocationEl.koordinates}
            properties={{ balloonContent: "Sizning joylashuvingiz" }}
            options={{
              iconLayout: "default#image",
              iconImageHref: MarkerSearch,
              iconImageSize: [30, 32],
              iconImageOffset: [-15, -15],
            }}
          />
        )}
        {
          places.map((place) => (
            <Placemark
              onClick={() => openModal(place)}
              key={place.id}
              geometry={place.koordinates}
              properties={{ balloonContent: place.type }}
              options={{
                iconLayout: "default#image",
                iconImageHref: Marker,
                iconImageSize: [30, 32],
                iconImageOffset: [-15, -42],
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
        <h2 className="text-center font-bold text-[18px] pb-2 ">
          Земельный участок: {selectedPlace?.kadastreNumber}
        </h2>
        <hr />
        <div className="flex flex-col gap-y-2 mt-2">
            <span className="font-bold flex items-center gap-x-2">
              Кадастровый номер:{" "}
              <p className="font-normal">{selectedPlace?.kadastreNumber}</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
              Кадастровый квартал:{" "}
              <p className="font-normal">{selectedPlace?.data?.gkn?.objectData?.parentCadNum}</p>
            </span>
            <span className="font-bold flex items-start gap-x-2">
              Адрес: <p className="font-normal">{selectedPlace?.data?.gkn?.objectData?.objectAddress}</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
            Площадь декларированная:{" "}
              <p className="font-normal">{selectedPlace?.data?.egrp?.parcelData.areaValue} km2</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
              Категория земель:{" "}
              <p className="font-normal">{selectedPlace?.data?.egrp.parcelData.categoryTypeValue}</p>
            </span>
            <span className="font-bold flex items-start gap-x-2">
              Разрешенное использование:{" "}
              <p className="font-normal">{selectedPlace?.data?.egrp.parcelData.utilByDoc}</p>
            </span>
            <span className="font-bold flex items-center gap-x-2">
              Кадастровая стоимость:{" "}
              <p className="font-normal">{
              new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
                selectedPlace?.data?.gkn.objectData.parcelData.cadCostValue,
              )
              }</p>
            </span>
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

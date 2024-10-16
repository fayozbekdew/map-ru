import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark, TypeSelector } from "react-yandex-maps";
import { CloseBtn, Marker, MarkerSearch, SearchImg, StoryImg } from "../assets";
import Modal from "react-modal";
import { MapContext } from "../contex/contex";
import { useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const MapEl = ({ setPlaces, places }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState([55.751574, 37.573856]);
  const { searchLocationEl, searchLocation } = useContext(MapContext);
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
  }, [searchLocationEl]);
function deleteElement(id){
  supabase
      .from("objects")
      .delete()
      .eq("id", id)
      .then((res) => {
        toast("Объект успешно удален", {
          type: "success",
          position: "top-right",
        });
        fetchObjects();
      })
      .catch((error) => {
        console.error("Error deleting object:", error);
      });
      setPlaces(places.filter(place => place.id !== id));
      closeModal();
}
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
        <span className="sticky bottom-[-15px] left-[50%] flex items-center justify-center bg-white w-full h-[70px] ">
        <button onClick={() => deleteElement(selectedPlace?.id)} className="text-center py-2 bg-red-400 h-10 w-[95%] flex items-center justify-center text-white font-semibold text-[18px] rounded-md  cursor-pointer">
        Удалить информацию
        </button>
        </span>
       
      </Modal>
    </YMaps>
  );
};

export default MapEl;

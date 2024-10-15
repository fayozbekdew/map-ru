import React, { useState,useRef,useEffect } from "react";
import {useContext} from "react"
import { toast } from "react-toastify";
import { SearchImg } from "../assets";
import { MapContext } from '../contex/contex'
import { supabase } from "../lib/supabaseClient";

function Input({ placeholder, type, label, img, height, setSearchEl, places }) {
  const {searchLocation, searchLocationEl} = useContext(MapContext)
  const [curentData,setCurentData] = useState([])
  const searchInput = useRef(null)
  useEffect(() => {
    const fetchObjects = async () => {
      const { data, error } = await supabase.from("objects").select("*");
  
      if (error) {
        console.error("Error fetching objects:", error);
      } else {
        setCurentData(data)
      }
    };
    fetchObjects();
  },[])
  function filteredFn(e) {
     e.preventDefault()
     const filteredList = curentData.filter(el => {
        return el.kadastreNumber.includes(searchInput.current.value)
     })
     if (filteredList.length > 0) {
      searchLocation(filteredList[0])
      // searchInput.current.value = ''
     }else{
        fetching(searchInput.current.value)
        // searchInput.current.value = ''
     }
     function fetching(number) {
      fetch(
        `https://rosreestr.ru.net/fir_rest/api/gkn_egrp/${number}?token=9ee3cf9be49e095f833f65cc9c8147e525a4d6c6`
      )
        .then((response) => response.json())
        .then((data) => {
          const address = data?.egrp?.objectData?.addressNote;
          if (address) {
            return { rosreestrData: data, address }; // Rosreestr ma'lumotlarini qaytarish
          } else {
            toast.error("Кадастровый номер недоступен.", {
              position: "top-center",
            });
          }
        })
        .then(({ rosreestrData, address }) => {
          if (address) {
            return fetch(
              `https://geocode-maps.yandex.ru/1.x/?apikey=59877cbf-2654-4cfc-b2bc-626e1807065f&geocode=${address}&format=json`
            )
              .then((response) => response.json())
              .then((geocodeData) => {
                const newObj = {
                  koordinates:
                    geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                      .split(" ")
                      .reverse(),
                  kadastreNumber: number,
                  data: rosreestrData, // Rosreestr ma'lumotlarini to'g'ridan-to'g'ri qo'shish
                };
               searchLocation(newObj)
              });
          }
        })
        .catch((error) => {
          toast.error("Xatolik yuz berdi: " + error.message);
          console.error("Error:", error);
        });
    }
  }
    return (
      <form onSubmit={(e) => filteredFn(e)} className={` relative flex  flex-col gap-y-1`}>
        <input
          // onChange={(e) => filteredFn(e.target.value)}
          ref={searchInput}
          className={`max-w-full w-[1000px] h-[${height}]  rounded-md pl-3 text-[20px] outline-none border border-black backdrop-blur-sm bg-white/30`}
          type={type}
          placeholder={placeholder}
        />
        <button className="absolute top-[50%] translate-y-[-50%] right-2">
          <img
            src={SearchImg}
            width="30px"
            height="30px"
            alt="input img"
            className=""
          />
        </button>
      </form>
    );
}

export default Input;

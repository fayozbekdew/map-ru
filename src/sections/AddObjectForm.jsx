import React from "react";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function AddObjectForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  function onSubmit(data) {
    const { kadastreNumber } = data;
    kadastreNumber.split(",").map((number) => fetching(number));

    function fetching(number) {
      fetch(
        `https://rosreestr.ru.net/fir_rest/api/gkn_egrp/${number}?token=9ee3cf9be49e095f833f65cc9c8147e525a4d6c6`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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
                console.log(newObj);
                return supabase
                  .from("objects")
                  .insert([newObj])
                  .then((response) => {
                    if (response.error) {
                      toast.error("Объект уже существует");
                    } else {
                      navigate("/");
                      toast.success("Объект успешно добавлен");
                    }
                  });
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col pb-8 items-center border-b mb-4"
    >
      <div className="flex justify-around w-full">
        <label className="flex flex-col gap-y-1 text-[20px] w-[500px]">
          Кадастровый номер:
          <textarea
            cols="30"
            rows="5"
            placeholder="Каждый кадастровый номер должен быть разделён запятой!"
            {...register("kadastreNumber", { required: true })}
            className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
            type="text"
          />
        </label>
        <button className="px-4 h-10 py-2 rounded bg-green-500 text-white hover:bg-green-600">
          Сохранить информацию
        </button>
      </div>
    </form>
  );
}

export default AddObjectForm;

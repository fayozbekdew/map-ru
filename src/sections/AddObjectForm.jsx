import React from "react";
import MapInput from "../components/MapInput";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DATA } from "../../data/data";

function AddObjectForm() {
  const formRefs = useRef([]);
  const { register, handleSubmit } = useForm();
  const [rosreestrData, setRosreestrData] = useState(null);

  function onSubmit(data) {
    const { kadastreNumber } = data;
    console.log(kadastreNumber);

    // 1. Birinchi fetch so'rovi rosreestr.ru saytiga
    fetch(
      `https://rosreestr.ru.net/fir_rest/api/gkn_egrp/${kadastreNumber}?token=f30d116c1242a6247a67105da1f97a25b029026b`
    )
      .then((response) => response.json())
      .then((data) => {
        setRosreestrData(data);
        const address = data?.egrp?.objectData?.addressNote;
        if (address) {
          return fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=59877cbf-2654-4cfc-b2bc-626e1807065f&geocode=${address} ${kadastreNumber}&format=json`
          );
        } else {
          toast.error("Кадастровый номер недоступен.", {
            position: "top-center",
          });
        }
      })
      .then((response) => response.json())
      .then((geocodeData) => {
        const newObj = {
          koordinates:
            geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
              " "
            ).reverse(),
          kadastreNumber: kadastreNumber,
          data: rosreestrData,
        };
        return supabase
          .from("objects")
          .insert([newObj])
          .then((response) => {
            if (response.error) {
              toast.error("Объект уже существует");
            }
            toast.success("Объект успешно добавлен");
          });
      })
      .catch((error) => {
        toast.error("Xatolik yuz berdi: " + error.message);
        console.error("Error:", error);
      });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col pb-8 items-center border-b mb-4"
    >
      <div className="flex justify-around w-full">
        <label className="flex flex-col gap-y-1 text-[20px]">
          Кадастровый номер:
          <input
            {...register("kadastreNumber", { required: true })}
            className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
            type="text"
          />
        </label>
        <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
          Сохранить информацию
        </button>
      </div>
    </form>
  );
}

export default AddObjectForm;

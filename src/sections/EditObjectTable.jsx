import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Delete } from "../assets";
import Modal from "react-modal";

Modal.setAppElement("#root");
function EditObjectTable() {
  const [objects, setObjects] = useState([]);
  const accessCodeRef = useRef(null);
  // Ma'lumotlarni olish
  const fetchObjects = async () => {
    const { data, error } = await supabase.from("objects").select("*"); // Barcha ustunlarni tanlab olish

    if (error) {
      console.error("Error fetching objects:", error);
    } else {
      setObjects(data);
    }
  };

  useEffect(() => {
    fetchObjects(); // Komponent yuklanganda ma'lumotlarni olish
  }, []);
  function deleteObject(id) {
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
  }
  const openEditModal = (id) => {
    setEditingObject(objects.filter((obj) => obj.id == id));
    setModalIsOpen(true);
  };

  function updateAccessCode() {
    supabase
      .from("password-add")
      .update({ pass: accessCodeRef.current.value })
      .eq("id", 2001)
      .then((res) => {
        toast("Код доступа обновлен", {
          type: "success",
          position: "top-right",
        });
        accessCodeRef.current.value = "";
      })
      .catch((error) => {
        console.error("Error updating access code:", error);
      });
  }

  return (
    <div className="w-full max-w-[1300px] ml-8 mt-5">
      <div className="flex items-center  gap-2 mb-4 -mt-4">
        <label className="flex gap-2 text-xl">
          Обновить код доступа:
          <input
            ref={accessCodeRef}
            type="text"
            className="border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </label>
        <button onClick={updateAccessCode} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Обновите
        </button>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Кадастровый номер</th>
            <th className="py-2 px-4 border">Адрес</th>
            <th className="py-2 px-4 border">Координаты</th>
            <th className="py-2 px-4 border">Действие</th>
          </tr>
        </thead>
        <tbody>
          {objects.length > 0 ? (
            objects.map((object) => (
              <tr key={object.id}>
                <td className="py-2 px-4 border">{object.kadastreNumber}</td>
                <td className="py-2 px-4 border">{object?.data?.egrp?.objectData?.addressNote}</td>
                <td className="py-2 px-4 border">
                  {object.koordinates.join(", ")}
                </td>
                <td className="py-2 px-4 border flex justify-center">
                  <img
                    onClick={() => deleteObject(object.id)}
                    src={Delete}
                    className="w-8 h-8 cursor-pointer"
                    alt=""
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-2 px-4 border text-center">
                Данные не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EditObjectTable;

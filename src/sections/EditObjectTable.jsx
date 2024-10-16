import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Delete } from "../assets";
import Modal from "react-modal";
import { useContext } from "react";
import { MapContext } from "../contex/contex";

Modal.setAppElement("#root");
function EditObjectTable() {
  const [objects, setObjects] = useState([]);
  const { checkedElementsFn, checkedElements } = useContext(MapContext);

  function deleteBtn() {
    if (checkedElements.size === 0) {
      toast("Объекты не выбраны", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    [...checkedElements].map((id) => {
      deleteObject(id);
      checkedElementsFn(id, objects);
    });
  }
  useEffect(() => {
    console.log(checkedElements);
  }, [checkedElements.size]);
  function allCheckedInner() {
    checkedElementsFn("all", objects);
  }

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

  return (
    <div className="w-full max-w-[1300px] ml-8 mt-5">
      {checkedElements.size > 0 && (
        <button
          onClick={() => deleteBtn()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold mb-3 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          удалить выбранные
        </button>
      )}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th onChange={allCheckedInner} className="py-2 px-4 border">
              <input type="checkbox" id="" />
            </th>
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
                <th className="py-2 px-4 border">
                  <input
                    checked={checkedElements.has(object.id) ? true : false}
                    onChange={() => checkedElementsFn(object.id)}
                    type="checkbox"
                    id=""
                  />
                </th>
                <td className="py-2 px-4 border">{object.kadastreNumber}</td>
                <td className="py-2 px-4 border">
                  {object?.data?.egrp?.objectData?.addressNote}
                </td>
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

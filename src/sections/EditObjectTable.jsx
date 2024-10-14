import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Delete, Edit } from "../assets";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import MapInput from "../components/MapInput";

Modal.setAppElement("#root");
function EditObjectTable() {
  const [objects, setObjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingObject, setEditingObject] = useState([]);
  const { register, handleSubmit } = useForm();
  const formRef = useRef(null);
  const koordinateRef = useRef(null);
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
  const closeModal = () => {
    setModalIsOpen(false); // Modalni yopish
  };
  const openEditModal = (id) => {
    setEditingObject(objects.filter((obj) => obj.id == id));
    setModalIsOpen(true);
  };
  function editObject(data) {
    supabase
      .from("objects")
      .update(data)
      .eq("id", editingObject[0].id)
      .then((res) => {
        toast("Объект успешно обновлен", {
          type: "success",
          position: "top-right",
        });
        fetchObjects();
      })
      .catch((error) => {
        console.error("Error updating object:", error);
      });
    closeModal();
    formRef.current.reset();
  }

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
            <th className="py-2 px-4 border">Тип</th>
            <th className="py-2 px-4 border">Вид</th>
            <th className="py-2 px-4 border">Кадастровый номер</th>
            <th className="py-2 px-4 border">Адрес</th>
            <th className="py-2 px-4 border">Площадь уточненная</th>
            <th className="py-2 px-4 border">Категория земель</th>
            <th className="py-2 px-4 border">Разрешенное использование</th>
            <th className="py-2 px-4 border">Координаты</th>
            <th className="py-2 px-4 border">Действие</th>
          </tr>
        </thead>
        <tbody>
          {objects.length > 0 ? (
            objects.map((object) => (
              <tr key={object.id}>
                <td className="py-2 px-4 border">{object.type}</td>
                <td className="py-2 px-4 border">{object.view}</td>
                <td className="py-2 px-4 border">{object.kadastreNumber}</td>
                <td className="py-2 px-4 border">{object.adress}</td>
                <td className="py-2 px-4 border">{object.areaAdjusted}</td>
                <td className="py-2 px-4 border">{object.category}</td>
                <td className="py-2 px-4 border">{object.useArea}</td>
                <td className="py-2 px-4 border">
                  {object.koordinates.join(", ")}
                </td>
                <td className="py-2 px-4 border flex gap-3">
                  <img
                    onClick={() => openEditModal(object.id)}
                    src={Edit}
                    className="w-8 h-8 cursor-pointer"
                    alt=""
                  />
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
      {/* Modal uchun */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Object Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            width: "800px",
            height: "600px",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <h2 className="text-xl mb-4 text-center font-bold">Обновить объект</h2>
        <div className="flex flex-col gap-4">
          <form
            ref={formRef}
            onSubmit={handleSubmit(editObject)}
            className="w-full flex flex-col pb-8 items-center border-b -mb-4"
          >
            <div className="flex justify-around w-full">
              <div className="flex flex-col w-full max-w-[300px]">
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Тип:
                  <input
                    {...register("type")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.type}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Вид:
                  <input
                    {...register("view")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.view}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Кадастровый номер:
                  <input
                    {...register("kadastreNumber")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.kadastreNumber}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Кадастровый квартал:
                  <input
                    {...register("kadastreKvartal")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.kadastreKvartal}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Адрес:
                  <input
                    {...register("adress")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.adress}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Площадь уточненная:
                  <input
                    {...register("areaAdjusted")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.areaAdjusted}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Статус:
                  <input
                    {...register("status")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.status}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Категория земель
                  <select
                    {...register("category")}
                    className="w-full border h-12  border-gray-700 outline-none pl-2 rounded-sm"
                    cols="30"
                    rows="2"
                    defaultValue={editingObject[0]?.category}
                  >
                    <option selected value="промышленности">
                      Земли промышленности
                    </option>
                    <option value="поселений">земли поселений</option>
                    <option value="сельскохозяйственного">
                      земли сельскохозяйственного назначения{" "}
                    </option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col w-full max-w-[300px]">
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Разрешенное использование:
                  <input
                    {...register("useArea")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.useArea}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Форма собственности:
                  <input
                    {...register("ownership")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.ownership}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  Кадастровая стоимость:
                  <input
                    {...register("kadasteValue")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="text"
                    defaultValue={editingObject[0]?.kadasteValue}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  дата определения:
                  <input
                    {...register("dateDetermination")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="date"
                    defaultValue={editingObject[0]?.dateDetermination}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  дата утверждения:
                  <input
                    {...register("approvaDate")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="date"
                    defaultValue={editingObject[0]?.approvaDate}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  дата внесения сведений:
                  <input
                    {...register("enteringDate")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="date"
                    defaultValue={editingObject[0]?.enteringDate}
                  />
                </label>
                <label className="flex flex-col gap-y-1 text-[20px]">
                  дата применения:
                  <input
                    {...register("dateApplication")}
                    className="w-full border border-gray-700 outline-none pl-2 rounded-sm"
                    type="date"
                    defaultValue={editingObject[0]?.dateApplication}
                  />
                </label>
                <MapInput koordinate={koordinateRef} />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 w-full my-2"
            >
              Saqlash
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white p-2 w-full"
            >
              Yopish
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default EditObjectTable;

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import AddObjectForm from "../sections/AddObjectForm";
import { useNavigate } from "react-router-dom";
import EditObjectTable from "../sections/EditObjectTable";

function AddObject() {
  const [activeButton, setActiveButton] = useState("newObject");
  const navigate = useNavigate();
  
  return (
    <div className="w-[1300px] h-screen flex flex-col  ">
      <ToastContainer />
      <header className="w-full mx-6  bg-gray-800 text-white  p-4 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(-1)} 
          >
            Возвращаться
          </button>
          <span className="flex space-x-4">
            <button
              className={`font-bold py-2 px-4 rounded ${
                activeButton === "newObject"
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={() => setActiveButton("newObject")} // Tugmani faollashtiradi
            >
             Новый объект
            </button>
            <button
              className={`font-bold py-2 px-4 rounded ${
                activeButton === "editObject"
                  ? "bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={() => setActiveButton("editObject")} 
            >
              Изменить или удалить
            </button>
          </span>
        </div>
      </header>
      
      {activeButton === "newObject" ? <AddObjectForm /> : <EditObjectTable/> }
    </div>
  );
}

export default AddObject;

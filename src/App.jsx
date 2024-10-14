import { useState,useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import AddObject from "./pages/AddObject";
import UserPage from "./pages/UserPage";

function App() {
  const [pass,setPass] = useState('')
  const fetchObjects = async () => {
    const { data, error } = await supabase.from("password-add").select("*");

    if (error) {
      console.error("Error fetching objects:", error);
    } else {
      setPass(data[0].pass)
    }
  };
  useEffect(() => {
    fetchObjects();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<UserPage pass={pass} />} />
      <Route path="add" element={<AddObject />} />
    </Routes>
  );
}

export default App;

import React, { useState,useEffect } from "react";

import { supabase } from "../lib/supabaseClient";
import Header from "../sections/Header";
import MapEl from "../sections/Map";

function UserPage({pass}) {
  const [searchEl, setSearchEl] = useState([]);
  const [places, setPlaces] = useState([]);
  // const [searchLocation,setSearchLocation] = useState(null)
  let [DATA, setData] = useState([]); 
  useEffect(() => {
    const fetchObjects = async () => {
      const { data, error } = await supabase.from("objects").select("*");
  
      if (error) {
        console.error("Error fetching objects:", error);
      } else {
        setPlaces(data);
        setData(data)
      }
    };
    fetchObjects();
  },[])
  console.log(DATA)
  return (
    <div className="w-full h-screen">
      <Header setSearchEl={setSearchEl}  setPlaces={setPlaces} places={places} data={DATA} pass={pass} />
      <MapEl setSearchEl={setSearchEl} searchEl={searchEl} places={places} />
    </div>
  );
}

export default UserPage;

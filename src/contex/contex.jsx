import { createContext, useReducer } from "react";
import reducer ,{ initialVal } from "./reducer";

export const MapContext = createContext();

function MapProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialVal);
  
    const searchLocation = (location) => {    
     let updateSearchLocation = state.searchLocation;
      updateSearchLocation = location
      dispatch({
        type: "search_location",
        payload: updateSearchLocation,
      });
    };
    const value = {
      searchLocationEl: state.searchLocation,
      searchLocation
    };
    return (
      <MapContext.Provider value={value}>{children}</MapContext.Provider>
    );
  }
  
  export default MapProvider;
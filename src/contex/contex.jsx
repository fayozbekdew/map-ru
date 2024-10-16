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


    const checkedElementsFn = (id,allObjects) => {
      if (id == 'all' && allObjects) {
        const elements = new Set(state.checkedElements);
        allObjects.map((obj) => {
          if (!elements.has(obj.id)){
            elements.add(obj.id);
          }else{
            elements.delete(obj.id);
          }
        })
        dispatch({
          type: "checked_elements",
          payload: elements,
        });
      }else if(id != 'all'){
        const elements = new Set(state.checkedElements);
      if (elements.has(id)) {
        elements.delete(id);
      } else {
        elements.add(id);
      }
      dispatch({
        type: "checked_elements",
        payload: elements,
      });
      }
    };
    const value = {
      searchLocationEl: state.searchLocation,
      checkedElements: state.checkedElements,
      searchLocation,
      checkedElementsFn,
    };
    return (
      <MapContext.Provider value={value}>{children}</MapContext.Provider>
    );
  }
  
  export default MapProvider;
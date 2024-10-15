export const initialVal = {
    searchLocation: null
  };
  function MapReducer(state, action) {
    switch (action.type) {
      case "search_location":
        return {
          ...state,
          searchLocation: action.payload,
        };
      default:
        throw Error("Cannot match case in reducer");
    }
  }
  
  export default MapReducer;
  
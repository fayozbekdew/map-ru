export const initialVal = {
    searchLocation: null,
    checkedElements: new Set(),
  };
  function MapReducer(state, action) {
    switch (action.type) {
      case "search_location":
        return {
          ...state,
          searchLocation: action.payload,
        };
      case "checked_elements":
        return {
          ...state,
          checkedElements: action.payload,
        };
      case "all_checked":
        return {
          ...state,
          allChecked: action.payload,
        };
      default:
        throw Error("Cannot match case in reducer");
    }
  }
  
  export default MapReducer;
  
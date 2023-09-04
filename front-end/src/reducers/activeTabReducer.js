// activeTabReducer.js

const activeTabReducer = (state = "1", action) => {
    switch (action.type) {
      case "SET_ACTIVE_TAB":
        return action.payload;
      default:
        return state;
    }
  };
  
  export default activeTabReducer;
  
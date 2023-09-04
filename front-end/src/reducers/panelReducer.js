
const initialState = null;

export const panelReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_OPEN_PANEL":
      return action.payload;
    default:
      return state;
  }
};

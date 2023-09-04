import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import activeTabReducer from "./activeTabReducer";
import { panelReducer } from "./panelReducer";


const rootReducer = combineReducers({
  user: userReducer,
  activeTab: activeTabReducer,
  panel: panelReducer,
});

export default rootReducer;

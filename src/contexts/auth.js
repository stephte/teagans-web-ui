import { createContext } from "react";
import { CSRF } from "../utilities/consts";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
	  	case "LOGIN":
	  		if (!action.payload) {
	  			console.log('CSRF does not exist');
	    		return;
	    	}

			localStorage.setItem(CSRF, action.payload);

	  		return {
	  			...state,
	  			isAuthed: true
	  		}
	    case "USER":
	    	// if current user found, then set 'isAuthed' to true
	    	return {
				user: action.payload,
				isAuthed: true
			};
	    case "LOGOUT":
			// clear localStorage
			localStorage.removeItem(CSRF);
			return {
				user: null,
				isAuthed: false
			}
	    default:
	    	return state;
	}
};
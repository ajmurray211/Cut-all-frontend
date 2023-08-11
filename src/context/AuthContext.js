import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    const [state, dispatch] = useReducer(authReducer, {
        user: storedUser !== null ? storedUser : null
    });

    useEffect(() => {
        if (storedUser) {
            dispatch({ type: "LOGIN", payload: storedUser });
        }
    }, []);

    console.log('auth context state:', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
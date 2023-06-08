import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const WorkersContext = createContext();

export const WorkersContextProvider = ({ children }) => {

    const [workerList, setWorkerList] = useState([]);
    const [API_URL, setAPI_URL] = useState(
        process.env.NODE_ENV === "production"
            ? "https://shielded-cove-45306.herokuapp.com/"
            : "http://localhost:8080/"
    );

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`${API_URL}user/`);
            setWorkerList(response.data.data)
        }
        fetchData();
    }, []);

    console.log('worker context state', API_URL, workerList)

    return (
        <WorkersContext.Provider value={{ API_URL, workerList }}>
            {children}
        </WorkersContext.Provider>
    );
};

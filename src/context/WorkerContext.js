import { createContext, useState, useEffect } from "react";
import { useDataFetcher } from "../hooks/useDataFetcher";
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
            console.log("fetching data...");
            const response = await axios.get(`${API_URL}user`);

            const uniqueNames = new Set(workerList);

            response.data.data.forEach((worker) => {
                if (worker.firstName) {
                    const name = `${worker.firstName}`;
                    if (!uniqueNames.has(name)) {
                        uniqueNames.add(name);
                    }
                }
            });
            setWorkerList(Array.from(uniqueNames));
        }
        fetchData();
    }, []);

    console.log('worker context state', API_URL, workerList)

    return (
        <WorkersContext.Provider value={{ workerList, API_URL }}>
            {children}
        </WorkersContext.Provider>
    );
};

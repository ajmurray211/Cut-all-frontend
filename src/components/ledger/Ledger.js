import axios from "axios";
import { useState, useEffect } from "react";

const Ledger = () => {
    // const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
    const API_URL = 'http://localhost:8080/'

    const [tickets, setTickets] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setTickets(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData(`${API_URL}ticket`)
    }, [])

    let mappedTickets = tickets.map((ticket) => {
        return(
            <li>{ticket.worker}s ticket for {ticket.billTo} on {ticket.date}</li>
        )
    })

    return (
        <>
        <h1>List of job tickets on file</h1>
        {mappedTickets}
        </>
        
    );
}

export default Ledger;
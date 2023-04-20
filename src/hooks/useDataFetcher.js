import { useState } from "react"
import axios from "axios"

export const useDataFetcher = (props) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const getData = (url) => {
        setLoading(true)
        setError(null)
        axios
            .get(url)
            .then((response) => setData(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    return { getData, data, setData, error, loading }
}
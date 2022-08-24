import './usageGraph.css'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UsageGraph = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const API_URL = 'https://fast-meadow-65226.herokuapp.com/'

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setData(response.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        // getData(`${API_URL}parts/?format=json`)
    }, [])

    const mockdata = [
        { name: 'Page A', Kyle: 40, Rilyn: 24, Pat: 20, Gordon: 30, amt: 5 },
        { name: 'Page B', Kyle: 10, Rilyn: 13, Pat: 20, Gordon: 30, amt: 20, },
        { name: 'Page C', Kyle: 20, Rilyn: 56, Pat: 20, Gordon: 30, mt: 22, },
        { name: 'Page D', Kyle: 27, Rilyn: 39, Pat: 20, Gordon: 30, amt: 20, },
        { name: 'Page E', Kyle: 18, Rilyn: 48, Pat: 20, Gordon: 30, amt: 21, },
        { name: 'Page F', Kyle: 23, Rilyn: 38, Pat: 20, Gordon: 30, amt: 25, },
        { name: 'Page G', Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30, amt: 21, },
    ];

    const renderLineChart = (
        <LineChart
            width={500}
            height={300}
            data={mockdata}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Rilyn" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Kyle" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Pat" stroke="#eb6e34" />
            <Line type="monotone" dataKey="Gordon" stroke="#4634eb" />
            <Line type="monotone" dataKey="Kim" stroke="#eb34b7" />
        </LineChart>
    )

    console.log(data)

    return (
        <div className='container'>
            <h1>Place holder for part search</h1>
            {renderLineChart}
        </div>
    );
}

export default UsageGraph;
import './usageGraph.css'
import { DropdownItem, Dropdown, DropdownToggle, DropdownMenu, Button } from 'reactstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UsageGraph = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [activeSort, setActiveSort] = useState('')

    // const API_URL = 'https://fast-meadow-65226.herokuapp.com/'
    const API_URL = 'http://localhost:8080/'


    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setData(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData(`${API_URL}parts/?format=json`)
        console.log(data)
    }, [])

    const mockdata = [
        { name: 'Jan', Kyle: 40, Rilyn: 24, Pat: 20, Gordon: 20 },
        { name: 'Feb', Kyle: 10, Rilyn: 13, Pat: 20, Gordon: 30 },
        { name: 'Mar', Kyle: 20, Rilyn: 56, Pat: 20, Gordon: 30 },
        { name: 'Apr', Kyle: 27, Rilyn: 39, Pat: 20, Gordon: 30 },
        { name: 'May', Kyle: 18, Rilyn: 48, Pat: 20, Gordon: 30 },
        { name: 'Jun', Kyle: 23, Rilyn: 38, Pat: 20, Gordon: 30 },
        { name: 'Jul', Kyle: 34, Rilyn: 63, Pat: 20, Gordon: 30 },
        { name: 'Aug', Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 20 },
        { name: 'Sep', Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30 },
        { name: 'Oct', Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30 },
        { name: 'Nov', Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30 },
        { name: 'Dec', Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30 },
    ];

    const renderLineChart = (
        <ResponsiveContainer
            width='95%'
            height={600}>
            <LineChart
                className='chart'

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
        </ResponsiveContainer>
    )

    const mappedParts = data.map((item) => {
        console.log(item)
        return (
            <DropdownItem action id={item.name} onClick={() => setActiveSort(`${item.name}`)} href=''>{`${item.name}`}</DropdownItem>
        )
    })

    return (
        <div className='container'>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret size="lg" dir='down'>
                    Parts
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => setActiveSort('')}> Clear search</DropdownItem>
                    {mappedParts}
                </DropdownMenu>
                {activeSort ? <Button id='sortedBy' disabled color='primary'>{activeSort}</Button> : <Button id='sortedBy' disabled color='warning'>No active search</Button>}
            </Dropdown>
            {renderLineChart}
        </div>
    );
}

export default UsageGraph;
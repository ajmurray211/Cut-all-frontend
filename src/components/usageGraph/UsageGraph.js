import './usageGraph.css'
import { DropdownItem, Dropdown, DropdownToggle, DropdownMenu, Button } from 'reactstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UsageGraph = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [activeSort, setActiveSort] = useState('')

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
        getData(`${API_URL}parts/?format=json`)
    }, [])

    const mockdata = [
        { name: 1, Kyle: 40, Rilyn: 24, Pat: 20, Gordon: 20},
        { name: 2, Kyle: 10, Rilyn: 13, Pat: 20, Gordon: 30},
        { name: 3, Kyle: 20, Rilyn: 56, Pat: 20, Gordon: 30},
        { name: 4, Kyle: 27, Rilyn: 39, Pat: 20, Gordon: 30},
        { name: 5, Kyle: 18, Rilyn: 48, Pat: 20, Gordon: 30},
        { name: 6, Kyle: 23, Rilyn: 38, Pat: 20, Gordon: 30},
        { name: 7, Kyle: 34, Rilyn: 63, Pat: 20, Gordon: 30},
        { name: 8, Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 20},
        { name: 9, Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30},
        { name: 10, Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30},
        { name: 11, Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30},
        { name: 12, Kyle: 34, Rilyn: 43, Pat: 20, Gordon: 30},
    ];

    const renderLineChart = (
        <LineChart
            className='chart'
            width={800}
            height={600}
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

    const mappedParts = data.map((item) => {
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
                {activeSort ? <Button id='sortedBy' disabled color='primary'>{activeSort}</Button> :<Button id='sortedBy' disabled color='warning'>No active search</Button>}
            </Dropdown>
            {renderLineChart}
        </div>
    );
}

export default UsageGraph;
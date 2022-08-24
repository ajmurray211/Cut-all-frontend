import './usageGraph.css'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const UsageGraph = () => {

    const data = [
        { name: 'Page A', Kyle: 40, Rilyn: 24, amt: 5 },
        { name: 'Page B', Kyle: 10, Rilyn: 13, amt: 20, },
        { name: 'Page C', Kyle: 20, Rilyn: 56, amt: 22, },
        { name: 'Page D', Kyle: 27, Rilyn: 39, amt: 20, },
        { name: 'Page E', Kyle: 18, Rilyn: 48, amt: 21, },
        { name: 'Page F', Kyle: 23, Rilyn: 38, amt: 25, },
        { name: 'Page G', Kyle: 34, Rilyn: 43, amt: 21, },
    ];

    const renderLineChart = (
        <LineChart
            width={500}
            height={300}
            data={data}
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

    return (
        <div className='container'>
            <h1>Place holder for part search</h1>
            {renderLineChart}
        </div>
    );
}

export default UsageGraph;
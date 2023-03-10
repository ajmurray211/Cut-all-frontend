import { Input, Table, Col } from 'reactstrap';
import { useState } from 'react'

const TimeSheet = (props) => {
    let mappedNames = ''
    const [helpers, setHelpers] = useState({
        Rilyn: {},
        Kyle: {},
        Pat: {},
        Gordon: {},
        Other: {}
    })

    const [data, setData] = useState({
        milage: null,
        jobBegin: null,
        jobEnd: null,
        travelBegin: null,
        travelEnd: null,
    })

    const handleChange = (e) => {
        setData((values) => ({
            ...values,
            [e.target.name]: e.target.value
        }));

        setHelpers((prevHelpers) => ({
            ...prevHelpers,
            [e.target.id]: data
        }));

        props.setValue((prevValues) => ({
            ...prevValues,
            helperTimes: {
                ...prevValues.helperTimes,
                [e.target.id]: {
                    ...data,
                    [e.target.name]: e.target.value
                }
            }
        }));
    };

    if (props.namesList) {
        mappedNames = props.namesList.map((name) => {
            return (
                <Col md={4}>
                    <Table bordered striped responsive hover >
                        <caption >
                            <h3>Time table for {name}</h3>
                        </caption>
                        <tbody>
                            <tr>
                                <th>Begin travel</th>
                                <td><Input type='time' name='travelBegin' id={name} onChange={handleChange}></Input></td>
                            </tr>
                            <tr>
                                <th>End travel</th>
                                <td><Input type='time' name='travelEnd' id={name} onChange={handleChange}></Input></td>
                            </tr>
                            <tr>
                                <th>Begin Job</th>
                                <td><Input type='time' name='jobBegin' id={name} onChange={handleChange}></Input></td>
                            </tr>
                            <tr>
                                <th>End job</th>
                                <td><Input type='time' name='jobEnd' id={name} onChange={handleChange}></Input></td>
                            </tr>
                            <tr>
                                <th>Milage</th>
                                <td><Input type='number' min={0} name='milage' id={name} onChange={handleChange}></Input></td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            )
        })
    }

    return (
        <section className='helperTimes'>
            {mappedNames}
        </section>
    );
}

export default TimeSheet;
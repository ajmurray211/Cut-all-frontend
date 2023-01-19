import {Input, Table} from 'reactstrap';

const TimeSheet = (props) => {
    return (
        <Table bordered striped responsive hover >
            <caption >
                <h3>Time table for other CA workers on the job</h3>
            </caption>
            <tbody>
                <tr>
                    <th>Begin travel</th>
                    <td><Input type='time' name='helperTravelBegin' id='helper' onChange={props.handleChange}></Input></td>
                </tr>
                <tr>
                    <th>End travel</th>
                    <td><Input type='time' name='helperTravelEnd' id='helper' onChange={props.handleChange}></Input></td>
                </tr>
                <tr>
                    <th>Begin Job</th>
                    <td><Input type='time' name='helperJobBegin' id='helper' onChange={props.handleChange}></Input></td>
                </tr>
                <tr>
                    <th>End job</th>
                    <td><Input type='time' name='helperJobEnd' id='helper' onChange={props.handleChange}></Input></td>
                </tr>
            </tbody>
        </Table>
    );
}

export default TimeSheet;
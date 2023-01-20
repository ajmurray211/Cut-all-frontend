import { Input, Table, Col } from 'reactstrap';

const TimeSheet = (props) => {
    let mappedNames = ''

    // console.log(props.namesList)
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
                                <td><Input type='time' name='helperTravelBegin' id={name} onChange={props.handleChange}></Input></td>
                            </tr>
                            <tr>
                                <th>End travel</th>
                                <td><Input type='time' name='helperTravelEnd' id={name} onChange={props.handleChange}></Input></td>
                            </tr>
                            <tr>
                                <th>Begin Job</th>
                                <td><Input type='time' name='helperJobBegin' id={name} onChange={props.handleChange}></Input></td>
                            </tr>
                            <tr>
                                <th>End job</th>
                                <td><Input type='time' name='helperJobEnd' id={name} onChange={props.handleChange}></Input></td>
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
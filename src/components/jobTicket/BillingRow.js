import { Form, Row, Col, Label, FormGroup, Input, Button, Table } from 'reactstrap';


const BillingRow = (props) => {
    return (
            <tr>
                <th scope="row">{props.index + 1}</th>
                <td><Input type='number'></Input></td>
                <td><Input type='number'></Input></td>
                <td><Input type='number'></Input></td>
                <td><Input type='text'></Input></td>
                <td><Input type='text'></Input></td>
                <td><Input type='number'></Input></td>
            </tr>
    );
}

export default BillingRow;
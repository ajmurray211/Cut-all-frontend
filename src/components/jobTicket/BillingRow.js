import { Input } from 'reactstrap';

const BillingRow = (props) => {
    return (
        <tr>
            <th scope="row">{props.index + 1}</th>
            <td><Input onChange={(event) => props.editRow(props.index, 'qty', event.target.value)} type='number'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'length', event.target.value)} type='number'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'depth', event.target.value)} type='number'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'workCode', event.target.value)} type='number'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'equipUsed', event.target.value)} type='text'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'amount', event.target.value)} type='number'></Input></td>
        </tr>
    );
}

export default BillingRow;
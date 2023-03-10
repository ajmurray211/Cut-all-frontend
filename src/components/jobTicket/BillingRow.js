import { Input } from 'reactstrap';

const BillingRow = (props) => {
    return (
        <tr className='billRow'>
            <td><Input onChange={(event) => props.editRow(props.index, 'qty', event.target.value)} type='number'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'length', event.target.value)} type='text'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'depth', event.target.value)} type='text'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'workCode', event.target.value)} type='text'></Input></td>
            <td><Input onChange={(event) => props.editRow(props.index, 'equipUsed', event.target.value)} type='textarea' id='descript'></Input></td>
            {/* <td><Input onChange={(event) => props.editRow(props.index, 'serialNum', event.target.value)} autoComplete={...serialNums} type='text' ></Input></td> */}
            <td>
                <Input
                    onChange={(event) => props.editRow(props.index, 'serialNum', event.target.value)}
                    autoComplete="on"
                    list="serialNums"
                    type="text"
                />
                <datalist id="serialNums">
                    {props.serialNumsList.map((serialNum) => (
                        <option value={serialNum} key={serialNum} />
                    ))}
                </datalist>
            </td>
        </tr>
    );
}

export default BillingRow;
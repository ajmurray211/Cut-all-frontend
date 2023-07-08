import DeleteIcon from '@mui/icons-material/Delete';
import { Input } from 'reactstrap';
import { IconButton, Tooltip } from '@mui/material';

const BillingRow = (props) => {
    return (
        < tr className='billRow scroll-container' >
            <td><Input value={props.ticketBody[props.index].qty} onChange={(event) => props.editRow(props.index, 'qty', event.target.value)} type='number'></Input></td>
            <td><Input value={props.ticketBody[props.index].length} onChange={(event) => props.editRow(props.index, 'length', event.target.value)} type='text'></Input></td>
            <td><Input value={props.ticketBody[props.index].depth} onChange={(event) => props.editRow(props.index, 'depth', event.target.value)} type='text'></Input></td>
            <td><Input value={props.ticketBody[props.index].workCode} onChange={(event) => props.editRow(props.index, 'workCode', event.target.value)} type='text'></Input></td>
            <td><Input value={props.ticketBody[props.index].equipUsed} onChange={(event) => props.editRow(props.index, 'equipUsed', event.target.value)} type='textarea' id='descript'></Input></td>
            <td>
                <Input
                    value={props.ticketBody[props.index].serialNum}
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
            <td>
                <Tooltip title="Delete">
                    <IconButton onClick={() => props.deleteRow(props.index)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </td>
        </tr >

    );
}

export default BillingRow;
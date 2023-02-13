import { Input } from "reactstrap";

const TimeRow = (props) => {
    return ( 
        <tr>
            {/* <th scope="row">1</th> */}
            <td>
              <Input onChange={e => props.editRow(e,props.i)} name = "startTime" type="text" />
            </td>
            <td>
              <Input onChange={e => props.editRow(e,props.i)}  name="endTime"   type="text" />
            </td>
            <td>
              <Input onChange={e => props.editRow(e,props.i)}  name="workCode"   type="text" />
            </td>
            <td>
              <Input onChange={e => props.editRow(e,props.i)}  name="jobName"   type="text" />
            </td>
            <td>
              <Input onChange={e => props.editRow(e,props.i)}  name="hours"   type="text" />
            </td>
            <td>
              <Input onChange={e => props.editRow(e,props.i)}  name="notes"   type="text" />
            </td>
          </tr>
     );
}
 
export default TimeRow;
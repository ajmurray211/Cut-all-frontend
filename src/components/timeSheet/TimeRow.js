import { Input } from "reactstrap";

const TimeRow = (props) => {
  return (
    <tr>
      {/* <th scope="row">1</th> */}
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="startTime"
          type="time"
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="endTime"
          type="time"
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="workCode"
          type="text"
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="jobName"
          type="text"
        />
      </td>
      <td>
        <Input
          onChange={(e) => {
            props.editRow(e, props.i);
          }}
          name="hours"
          type="number"
          min={0}
          defalutValue={0}
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="notes"
          type="textarea"
        />
      </td>
    </tr>
  );
};

export default TimeRow;

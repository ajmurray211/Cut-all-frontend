import { Input } from "reactstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';

const TimeRow = (props) => {
  return (
    <tr>
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
      <td>
        <Tooltip title="Delete">
          <IconButton onClick={() => props.deleteRow(props.i)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  );
};

export default TimeRow;

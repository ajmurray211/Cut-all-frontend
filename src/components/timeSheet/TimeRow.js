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
          value={props.sheetBody[props.i].startTime}
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="endTime"
          type="time"
          value={props.sheetBody[props.i].endTime}
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="workCode"
          type="text"
          value={props.sheetBody[props.i].workCode}
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="jobName"
          type="text"
          value={props.sheetBody[props.i].jobName}
        />
      </td>
      <td>
        <Input
          onChange={(e) => {
            props.editRow(e, props.i);
          }}
          name="hours"
          type="number"
          value={props.sheetBody[props.i].hours}
          min={0}
          defalutvalue={0}
        />
      </td>
      <td>
        <Input
          onChange={(e) => props.editRow(e, props.i)}
          name="notes"
          type="textarea"
          value={props.sheetBody[props.i].notes}
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

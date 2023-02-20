import { Table } from "reactstrap";

const InfoDisplay = (props) => {
  console.log(props);
  let mappedInfo = props.sheetBody.map((row) => {
    return (
      <tr>
        <td>{row.startTime}</td>
        <td>{row.endTime}</td>
        <td>{row.workCode}</td>
        <td>{row.jobName}</td>
        <td>{row.hours}</td>
        <td>{row.notes}</td>
      </tr>
    );
  });
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee Number</th>
            <th>Truck Number</th>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {props.sheetInfo.employeeName ? (
            <td>{props.sheetInfo.employeeName}</td>
          ) : (
            <td></td>
          )}
          {props.sheetInfo.employeeNum ? (
            <td>{props.sheetInfo.employeeNum}</td>
          ) : (
            <td></td>
          )}
          {props.sheetInfo.truckNum ? (
            <td>{props.sheetInfo.truckNum}</td>
          ) : (
            <td></td>
          )}
          {props.sheetInfo.title ? <td>{props.sheetInfo.title}</td> : <td></td>}
          {props.sheetInfo.status ? (
            <td>{props.sheetInfo.status}</td>
          ) : (
            <td></td>
          )}
          {props.sheetInfo.date ? <td>{props.sheetInfo.date}</td> : <td></td>}
        </tbody>
      </Table>
      <Table>
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Work Code</th>
            <th>Job Name</th>
            <th>Hours</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {mappedInfo}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <th>Total</th>
            <td>{props.total}</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default InfoDisplay;

import { useState, useEffect } from "react";
import { Input, Table, Label, FormGroup, Col, Form, Row, Button, Alert, ModalHeader, ModalBody, ModalFooter, Modal, } from "reactstrap";
import TimeRow from "./TimeRow";
import InfoDisplay from "./InfoDisplay";
import axios from "axios";
import { useModal } from "../../hooks/useModal";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useWorkerContext } from "../../hooks/useWorkerContext";

const TimeSheet = (props) => {
  const { API_URL, workerList } = useWorkerContext()
  const { user } = useAuthContext()
  const { isOpen: modal, toggleModal: toggle } = useModal();
  const [status, setStatus] = useState({
    code: null,
    mssg: null
  })
  const [sheetBody, setSheetBody] = useState([]);
  const [sheetInfo, setSheetInfo] = useState({
    employeeName: null,
    employeeNum: null,
    truckNum: null,
    title: null,
    status: null,
    date: null,
    id: null
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user) {
      setSheetInfo({
        employeeName: `${user.firstName} ${user.lastName}`,
        status: user.status,
        title: user.title,
        employeeNum: user.employeeNumber,
        truckNum: user.truckNumber,
        id: user._id
      });
    }
  }, []);

  // resets variables changing when status changes
  useEffect(() => {
    if (status.code !== null) {
      setTimeout(() => {
        setStatus({
          code: null,
          mssg: null
        });
        toggle();
      }, 8000);
    }
  }, [status]);

  const handleAddRow = (e) => {
    let row = {
      startTime: "",
      endTime: "",
      workCode: "",
      jobName: "",
      hours: "",
      notes: "",
    };
    let copy = [...sheetBody, row];
    setSheetBody(copy);
  };

  // changes values of the job row when the user changes and imput field
  const editRow = (e, i) => {
    let copy = [...sheetBody];
    copy[i][e.target.name] = e.target.value;
    setSheetBody(copy);
    let counter = 0;
    sheetBody.forEach((row) => {
      if (row.hours !== "") counter += parseFloat(row.hours);
    });
    setTotal(counter);
  };

  const deleteRow = (index) => {
    const updatedSheetBody = [...sheetBody];
    updatedSheetBody.splice(index, 1);
    setSheetBody(updatedSheetBody);
    setTotal(total - sheetBody[index].hours);
  }

  const handleChange = (e) => {
    setSheetInfo((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOptionSelect = (event) => {
    const selectedValue = event.target.value;
    const selectedWorker = workerList.find(
      (worker) => `${worker.firstName} ${worker.lastName}` === selectedValue
    );

    if (selectedWorker) {
      setSheetInfo({
        employeeName: `${selectedWorker.firstName} ${selectedWorker.lastName}`,
        status: selectedWorker.status,
        title: selectedWorker.title,
        employeeNum: selectedWorker.employeeNumber,
        truckNum: selectedWorker.truckNumber,
        id: selectedWorker._id
      });
    }
  };

  const mapRows = sheetBody.map((row, i) => {
    return <TimeRow i={i} key={i} editRow={editRow} handleChange={handleChange} deleteRow={deleteRow} sheetBody={sheetBody} />;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${API_URL}timeCards/${sheetInfo.id}`, { sheetBody, date: sheetInfo.date });
      let newStatus = {
        code: 'success',
        mssg: result.data.message,
      };
      setStatus(newStatus);

      // Reset values to defaults
      setSheetBody([]);
      setSheetInfo({
        employeeName: null,
        employeeNum: null,
        truckNum: null,
        title: null,
        status: null,
        date: null,
        id:null
      });
      setTotal(0);
    } catch (error) {
      console.log(error);
      setStatus({
        code: 'danger',
        mssg: error.response.data.message,
      });
    }
  };

  return (
    <div className="timeSheet">
      <h1>Time Sheet</h1>
      <Form className="timeCardData">
        <Row>
          <Col md={3} />
          <Col md={3}>
            <FormGroup>
              <Label for="employeeName">Employee Name</Label>
              <Input
                value={user ? `${user.firstName} ${user.lastName}` : sheetInfo.employeeName}
                id="employeeName"
                name="employeeName"
                placeholder="Who are you?"
                type="text"
                onChange={handleChange}
                autoComplete="on"
                list="workers"
                onSelect={handleOptionSelect}
              >
              </Input>
              <datalist id="workers">
                {workerList.map((worker) => (
                  <option
                    value={`${worker.firstName} ${worker.lastName}`}
                    key={`${worker.firstName} ${worker.lastName}`}
                  />
                ))}
              </datalist>
            </FormGroup>
          </Col>
          <Col md={3}>
            <Label for="title">Title</Label>
            <Input
              placeholder="Enter Employee title"
              value={user ? user.title : sheetInfo.title}
              onChange={handleChange}
              name="title"
              id="title"
              type="text"
            ></Input>
          </Col>
        </Row>
        <Row>
          <Col md={3} />
          <Col md={3}>
            <Label for="employeeNum">Employee Number</Label>
            <Input
              value={user ? user.employeeNumber : sheetInfo.employeeNum}
              placeholder="Enter Employee Number"
              onChange={handleChange}
              name="employeeNum"
              id="employeeNum"
              type="text"
            ></Input>
          </Col>
          <Col md={3}>
            <Label for="status">Status</Label>
            <Input
              placeholder="Enter Your Status"
              onChange={handleChange}
              value={user ? user.status : sheetInfo.status}
              name="status"
              id="status"
              type="text"
            ></Input>
          </Col>
        </Row>
        <Row>
          <Col md={3} />
          <Col md={3}>
            <Label for="truckNum">Truck Number</Label>
            <Input
              value={user ? user.truckNumber : sheetInfo.truckNum}
              required
              onChange={handleChange}
              placeholder="Enter truck number"
              name="truckNum"
              id="truckNum"
              type="text"
            ></Input>
          </Col>
          <Col md={3}>
            <Label for="date">Date</Label>
            <Input
              required
              onChange={handleChange}
              name="date"
              id="date"
              type="date"
              invalid={isNaN(Date.parse(sheetInfo.date))}
            ></Input>
          </Col>

        </Row>
      </Form>

      <Table bordered responsive striped>
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
        <tbody>{mapRows}</tbody>
      </Table>

      <Form>
        <Row>
          <Col md={4} />
          <Col md={3}>
            <Label for="Total">Total</Label>
          </Col>
          <Col md={2}>
            <Input
              readOnly
              min={0}
              value={total}
              id="Total"
              type="number"
            ></Input>
          </Col>
        </Row>
      </Form>

      <Button onClick={handleAddRow}>Add Row</Button>

      <div className="timeSheet workCodes">
        <h2>Work Codes:</h2>
        <ul>
          <li>G/S/S - Gas Slab Sawing</li>
          <li>C/C - Concrete Cutting</li>
          <li>A/C - Asphalt Cutting</li>
          <li>W/S - Wall Sawing</li>
          <li>H/S - Hand Sawing</li>
          <li>C/D - Core Drilling</li>
          <li>H/S/S - Push Sawing</li>
          <li>R&D C/C - Remove and Dispose of Concrete Off-site</li>
          <li>
            DEMO - Includes removing concrete (Off-site) with Trailer and/or
            Mini Excavator
          </li>
          <li>CS - Chainsaw, Chop Saw</li>
        </ul>
      </div>
      <Button
        disabled={sheetInfo.date === null || isNaN(Date.parse(sheetInfo.date)) || sheetBody.length == 0}
        onClick={(e) => {
          toggle();
        }}
      >
        Continue
      </Button>

      <Modal
        className="timeSheet confirmationModal"
        size="lg"
        centered
        isOpen={modal}
      >
        <ModalHeader toggle={toggle}>Time Sheet Confirmation</ModalHeader>
        <ModalBody>
          <Alert color={status.code} isOpen={status.mssg}>
            {status.mssg}
          </Alert>
          <InfoDisplay
            sheetInfo={sheetInfo}
            sheetBody={sheetBody}
            total={total}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TimeSheet;

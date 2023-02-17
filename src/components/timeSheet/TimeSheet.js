import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Label,
  FormGroup,
  Col,
  Form,
  Row,
  Button,
  Alert,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "reactstrap";
import TimeRow from "./TimeRow";
import emailjs from "@emailjs/browser";
import InfoDisplay from "./InfoDisplay";
import "./timeSheet.css";

const TimeSheet = () => {
  const [title, setTitle] = useState("");
  const [sheetBody, setSheetBody] = useState([]);
  const [sheetInfo, setSheetInfo] = useState({
    employeeName: null,
    employeeNum: null,
    truckNum: null,
    title: "operator",
    status: null,
    date: null,
    infoHTML: null,
  });
  let sheetHTML = [];
  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  // resets variables changing when status changes
  useEffect(() => {
    if (status === "OK") {
      setTimeout(() => {
        console.log(sheetInfo, "after email");
        setStatus("");
        setSuccess(false);
      }, 5000);
    } else if (status === "Error") {
      setTimeout(() => {
        setStatus("");
        setFail(false);
      }, 5000);
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
    console.log(sheetBody);
  };

  // changes values of the job row when the user changes and imput field
  const editRow = (e, i) => {
    let copy = [...sheetBody];
    copy[i][e.target.name] = e.target.value;
    setSheetBody(copy);
    console.log(sheetBody);
    let counter = 0;
    sheetBody.forEach((row) => {
      if (row.hours !== "") counter += parseFloat(row.hours);
    });
    setTotal(counter);
  };
  const handleChange = (e) => {
    console.log(e.target.name);
    setSheetInfo((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));
  };

  const mapRows = sheetBody.map((row, i) => {
    sheetHTML.push(
      `<tr><td>${row.startTime}</td><td>${row.endTime}</td><td>${row.workCode}</td><td>${row.jobName}</td><td>${row.hours}</td><td>${row.notes}</td></tr>`
    );
    return <TimeRow i={i} editRow={editRow} handleChange={handleChange} />;
  });
  const compileHTML = () => {
    let combined = sheetHTML.join(" ");
    console.log(combined, sheetInfo);
    setSheetInfo((value) => ({
      ...value,
      infoHTML: `<table style="border-collapse: collapse; width: 96.2382%; border-width: 1px; border-color: rgb(0, 0, 0);" border="1"><colgroup><col style="width:4%;"><col style="width: 4%;"><col style="width:4%;"><col style="width:7%;"><col style="width:4%;"><col style="width:7%;"></colgroup>
        <thead>
        <tr> <th>Start Time</th> <th>End Time</th> <th>Work Code</th> <th>Job Name</th> <th>Hours</th> <th>Notes</th> </tr>
        </thead>
        <tbody>
        ${combined}
        <tr> <td style = "background-color: rgb(128, 128, 128);" ></td> <td style = "background-color: rgb(128, 128, 128);" ></td> <td style = "background-color: rgb(128, 128, 128);" ></td> <th>Total</th> <td>${total}</td> <td style = "background-color: rgb(128, 128, 128);" ></td> </tr>
        </tbody></table>`,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // setStatus('OK')
    emailjs
      .send(
        "service_v3kf86l",
        "template_5kfgkxl",
        sheetInfo,
        "E5-2RW9TeJyvAH3_r"
      )
      .then(
        (result) => {
          setStatus(result.text);
          setSuccess(true);
        },
        (error) => {
          setFail(true);
          setStatus("Error");
          console.log(error);
        }
      );
  };

  return (
    <div className="timeSheet">
      <Alert color="success" isOpen={success}>
        You have submitted a time sheet!
      </Alert>
      <Alert color="danger" isOpen={fail}>
        There was a problem with your time sheet submission!
      </Alert>
      <h1>This is the time sheet chode</h1>
      <Form>
        <Row>
          <Col md={3} />
          <Col md={3}>
            <FormGroup>
              <Label for="employeeName">Employee Name</Label>
              <Input
                id="employeeName"
                name="employeeName"
                placeholder="Who are you?"
                type="select"
                onChange={handleChange}
              >
                <option></option>
                <option>Rilyn</option>
                <option>Kyle</option>
                <option>Pat</option>
                <option>Gordon</option>
                <option>Kim</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={3}>
            <Label for="title">Title</Label>
            <Input
              defaultValue={"operator"}
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
              onChange={handleChange}
              name="employeeNum"
              id="employeeNum"
              type="text"
            ></Input>
          </Col>
          <Col md={3}>
            <Label for="status">Status</Label>
            <Input
              onChange={handleChange}
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
              onChange={handleChange}
              name="truckNum"
              id="truckNum"
              type="text"
            ></Input>
          </Col>
          <Col md={3}>
            <Label for="date">Date</Label>
            <Input
              onChange={handleChange}
              name="date"
              id="date"
              type="date"
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
            <th>Job Number</th>
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
              min={0}
              defaultValue={0}
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
        onClick={(e) => {
          compileHTML();
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

import { Alert, Form, Row, Col, Label, FormGroup, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const JobDetails = (props) => {

    return (
        <div>
            <section id='workerInput'>
                <h2>Job information:</h2>
                <ul id='inputContainer'>
                    <li><span className='inputItem'>Who worked</span>:{props.value['worker']}</li>
                    <li><span className='inputItem'>Bill to</span>:{props.value['billTo']}</li>
                    <li><span className='inputItem'>Other CA men on the job</span>:{props.value['otherWorkers']}</li>
                    <li><span className='inputItem'>Truck number</span>:{props.value['truckNum']}</li>
                    <li><span className='inputItem'>Date</span>:{props.value['date']}</li>
                    <li><span className='inputItem'>Address</span>:{props.value['address']}</li>
                    <li><span className='inputItem'>Work completed</span>:
                        <ul>
                            {props.mappedjobInfo}
                        </ul>
                    </li>
                </ul>
                <h3>Hours Spent</h3>
                <ul id='timeBreakdown'>
                    {props.value['travelTotal'] && props.value['travelTotal'] !== 0 ? <li>{props.value['travelTotal']} min were spent traveling for this job.</li> : ''}
                    {props.value['jobTotal'] && props.value['jobTotal'] !== 0 ? <li>{props.value['jobTotal']} min were spent on the job site working.</li> : ''}
                    {props.value.wallSawing ? <li>{`Wall sawing took ${props.value.wallSawing} min.`}</li> : ''}
                    {props.value.coreDrilling ? <li>{`Core drilling took ${props.value.coreDrilling} min.`}</li> : ''}
                    {props.value.waterControl ? <li>{`Water control took ${props.value.waterControl} min.`}</li> : ''}
                    {props.value.slabSaw ? <li>{`Slab sawing took ${props.value.slabSaw} min.`}</li> : ''}
                    {props.value.hammerChipping ? `Jack hammer chipping took ${props.value.hammerChipping} min.` : ''}
                    {props.value.loadExcevate ? <li>{`Load excevate took ${props.value.loadExcevate} min.`}</li> : ''}
                    {props.value.haul ? <li>{`Hauling took ${props.value.haul} min.`}</li> : ''}
                    {props.value.handLabor ? <li>{`Hand labor took ${props.value.handLabor} min.`}</li> : ''}
                    {props.value.dumpYards ? <li>{`Dump yards took ${props.value.dumpYards} min.`}</li> : ''}
                    {props.value.release ? <li>{`Releases took ${props.value.release} min.`}</li> : ''}
                    {props.value.standby ? <li>{`Standby took ${props.value.standby} min.`}</li> : ''}
                    {props.value.other ? `other time took ${props.value.other} min.` : ''}
                    {props.value.downTime ? <li>{`Down time took ${props.value.downTime} min.`}</li> : ''}
                </ul>
            </section>

            <section id='legalDisclaimer'>
                <h2> Standard job conditions:</h2>
                <ul>
                    <li>1. Layout of work by others prior to arrival of operator.</li>
                    <li>2. We cannot accept responsibility for damage to buried objects such as conduit, steel pipes, etc.</li>
                    <li>3. All prices based on a maximum work height of 8’. Scaffolding supplied and erected by others unless prior arrangements are made.</li>
                    <li>4. Water and power available within 150’ of work area. Parking for truck and power unit within 150’ of work area.</li>
                    <li>5. Traffic control, water and/or dust partition by others.</li>
                    <li>6. We reserve the right to bill all work on an hourly basis due to difficult working conditions and/or heavy reinforcing.</li>
                    <li>7. If for any reason are unable to work due to no fault of our own, then we must charge for stand-by time.</li>
                    <li>8. Contractor is responsible for covering holes created by sawing and drilling.</li>
                    <li>9. In the event of non-payment of any amount, when due, purchaser agrees to pay all collection costs including reasonable attorney fees.</li>
                </ul>
            </section>

            <FormGroup>
                <Label for='CC'>Contractor email:</Label>
                <Input id='CC' type='text' name='CC' onChange={props.handleChange} />
                <br></br>
                <Label for='CC'>PO number:</Label>
                <Input id='CC' type='text' name='poNum' onChange={props.handleChange} />
                <br></br>
                <Label for='CC'>Job number:</Label>
                <Input id='CC' type='text' name='JobNum' onChange={props.handleChange} />
                <br></br>
                <Input id='confirmation' type='checkbox' onChange={(e) => console.log(e.target.checked)} />
                <Label for="confirmation">
                    :I have reviewed the above information and confirm the information is correct.
                </Label>
                <br></br>
                <Label for="confirmationName">
                    Typing your name acts as an e-signature:
                </Label>
                <Input type='text' name='confirmationName' id='confirmationName' onChange={props.handleChange} />
            </FormGroup>
        </div>
    )
}

export default JobDetails;
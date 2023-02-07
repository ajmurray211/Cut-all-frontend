import React, { forwardRef, useImperativeHandle } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Table } from 'reactstrap';

const MyComponentToPrint = forwardRef((props, ref) => {
    console.log(props.value)
    const handlePrint = () => {
        window.print()
    }

    useImperativeHandle(ref, () => ({
        handlePrint
    }));

    const findTimes = (start, end) => {
        let d1 = Date.parse(`2023-01-15T${start}:00.000`);
        let d2 = Date.parse(`2023-01-15T${end}:00.000`);
        const milliseconds = Math.abs(d1 - d2);
        const secs = Math.floor(milliseconds / 1000);
        const mins = Math.floor(secs / 60);
        const minutes = mins % 60
        const hours = Math.floor(mins / 60);
        return {
            mins: mins,
            hours: hours,
            minutes: minutes,
            combined: `${hours}hr. ${minutes}min.`
        }
    }

    let helpersParsedData = []
    if (props.value.helperTimes) {
        for (let name in props.value.helperTimes) {
            if (Object.keys(props.value['helperTimes'][name]).length != 0) {
                let totalJob = findTimes(props.value['helperTimes'][name].jobBegin, props.value['helperTimes'][name].jobEnd)
                let totalTravel = findTimes(props.value['helperTimes'][name].travelBegin, props.value['helperTimes'][name].travelEnd)
                helpersParsedData.push([name, totalJob, totalTravel, props.value['helperTimes'][name]])
            }
        }
    }

    let mappedHelpers = helpersParsedData.map((worker) => {
        console.log(worker)
        let totalMins = worker[1].mins + worker[2].mins
        const minutes = totalMins % 60
        const hours = Math.floor(totalMins / 60);
        return (
            <tr className='helperInfoLine'>
                <td> {worker[0]} </td> <td> {worker[3].travelBegin} - {worker[3].travelEnd} </td> <td> {worker[3].jobBegin} - {worker[3].jobEnd} </td><td>{hours}hr. {minutes}.min</td> <td>{worker[3].milage}</td>
            </tr>
        )
    })

    const mappedjobInfo = props.value.jobInfo.map((row, index) => {
        return (
            <tr className='jobInfoLine'>
                <td> {row.qty} </td> <td> {row.length} </td> <td> {row.depth} </td> <td> {row.workCode} </td>  <td> {row.equipUsed} </td> <td>{row.serialNum}</td>
            </tr>
        )
    })

    return (
        <div id='ticketBody' ref={ref} >
            <section className='half' id='left'>
                <h3>Job Information:</h3>
                <ul id='inputContainer'>
                    <Table
                        size='sm'
                        bordered>
                        <tbody>
                            <tr>
                                <td>Truck Num.</td>
                                <td>{props.value.truckNum}</td>
                                {/* <td>Job Times</td>
                                <td>{props.value.jobBegin} - {props.value.jobEnd}</td> */}
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td>{props.value.address}</td>
                                {/* <td>Travel Times</td>
                                <td>{props.value.travelBegin} - {props.value.travelEnd}</td> */}
                            </tr>
                        </tbody>
                    </Table>
                    <li><span className='inputItem'>Work Completed</span>:
                        <Table
                            title='Work Completed'
                            bordered
                            size='sm'
                            responsive
                        >
                            <thead>
                                <tr>
                                    <th>QTY</th>
                                    <th>Length/DIA</th>
                                    <th>Depth</th>
                                    <th>Work Code</th>
                                    <th>Description / Equip. Used</th>
                                    <th>Blade serial #</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mappedjobInfo}
                            </tbody>

                        </Table>
                    </li>
                    <li> <span className='inputItem'>CA men on the job and their times.</span>
                        <Table
                            size='sm'
                            bordered>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Travel Time</th>
                                    <th>Job Time</th>
                                    <th>Total Time</th>
                                    <th>Milage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>{props.value.worker}</td>  <td>{props.value.travelEnd ? `${props.value.travelBegin} - ${props.value.travelEnd}` : '-'}</td>  <td>{props.value.jobEnd ? `${props.value.jobBegin} - ${props.value.jobEnd}` : '-'}</td>  <td>{props.value.totalPaidTime}</td> <td>{props.value.milage}</td></tr>
                                {mappedHelpers}
                            </tbody>
                        </Table>
                    </li>

                </ul>
            </section>

            <section className='half' id='right'>
                <Table
                    bordered
                    size="sm"
                >
                    <thead>
                        <tr>
                            <th>Hours Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>{props.value.wallSawing ? <th>{`Wall sawing took ${props.value.wallSawing} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.coreDrilling ? <th>{`Core drilling took ${props.value.coreDrilling} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.waterControl ? <th>{`Water control took ${props.value.waterControl} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.slabSaw ? <th>{`Slab sawing took ${props.value.slabSaw} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.hammerChipping ? `Jack hammer chipping took ${props.value.hammerChipping} hrs.` : ''} </tr>
                        <tr>{props.value.loadExcevate ? <th>{`Load excevate took ${props.value.loadExcevate} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.haul ? <th>{`Hauling took ${props.value.haul} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.handLabor ? <th>{`Hand labor took ${props.value.handLabor} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.dumpYards ? <th>{`Dump yards took ${props.value.dumpYards} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.release ? <th>{`Releases took ${props.value.release} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.standby ? <th>{`Standby took ${props.value.standby} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.other ? <th>{`other time took ${props.value.other} hrs.`}</th> : ''} </tr>
                        <tr>{props.value.downTime ? <th>{`Down time took ${props.value.downTime} hrs.`}</th> : ''} </tr>
                    </tbody>
                </Table>
                {props.value.detailsNotCovered ? <h3>Other Job Details</h3> : ''}
                <p>{props.value.detailsNotCovered}</p>

                <section id='confirmationDetails'>
                    <ul>
                        {props.value.poNum ? <li>{`PO #: ${props.value.poNum}.`}</li> : ''}
                        {props.value.jobNum ? <li>{`Job #: ${props.value.jobNum}.`}</li> : ''}
                        {props.value.CC ? <li>{`Email sent to: ${props.value.CC}`}</li> : ''}
                    </ul>
                    I {props.value.confirmationName} have read and agreed to the details and conditions of the job ticket above on behalf of {props.value.billTo}.
                </section>
            </section>
        </div>
    )
});

export default MyComponentToPrint;
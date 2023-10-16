import axios from 'axios';
import { useState, useEffect } from 'react';
import { Input, Label, Table } from 'reactstrap';
import { useWorkerContext } from '../../hooks/useWorkerContext';

const EditTicket = ((props) => {
    const { API_URL, workerlist } = useWorkerContext()
    const [serialNumsList, setSerialNumsList] = useState([])
    const [helpers, setHelpers] = useState({ ...props.editedData.helperTimes })

    const changeTimes = (e, name, field, val) => {
        setHelpers((values) => ({
            ...values,
            [name]: {
                ...helpers[name],
                [field]: e.target.value
            }
        }))
    }

    useEffect(() => {
        props.setEditedData(values => ({
            ...values,
            helperTimes: helpers
        }))
    }, [helpers])

    useEffect(() => {
        axios
            .get(`${API_URL}serialNum/numsList`)
            .then((res) => {
                res.data.data.map((num) => {
                    if (!serialNumsList.includes(num.serialNum)) {
                        let copy = serialNumsList
                        copy.push(num.serialNum)
                        setSerialNumsList(copy)
                    }
                })
            })
    }, [serialNumsList])

    const handleChange = (e, i, key, val) => {
        const changeVal = (total, field) => {
            props.setEditedData(editedData => ({
                ...editedData,
                [e.target.name]: e.target.value,
                [field]: total,
            }))
        }

        if (e.target.name === 'jobEnd') {
            let total = findTimes(props.editedData['jobBegin'], e.target.value)
            changeVal(total, 'jobTotal')
        } else if (e.target.name === 'travelEnd') {
            let total = findTimes(props.editedData['travelBegin'], e.target.value)
            changeVal(total, 'travelTotal')
        } else if (e.target.name === 'infoRow') {
            let copy = [...props.editedData.jobInfo]
            copy[i][key] = val
            props.setEditedData(editedData => ({
                ...editedData,
                jobInfo: copy
            }))
        } else if (e.target.name === 'otherWorkers') {
            let selected = [...e.target.selectedOptions].map(i => i.value)
            props.setEditedData(editedData => ({
                ...editedData,
                [e.target.name]: selected
            }))
        } else if (e.target.name === 'helper') {
            let workersList = Object.keys(helpers)
            const oldName = workersList[i];
            const newName = e.target.value;
            const updatedHelpers = Object.fromEntries(
                Object.entries(helpers).map(([key, value]) => [
                    key === oldName ? newName : key,
                    value,
                ])
            );
            setHelpers(updatedHelpers);
        } else {
            props.setEditedData(editedData => ({
                ...editedData,
                [e.target.name]: e.target.value
            }))
        }
    }

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
    if (helpers) {
        for (let name in helpers) {
            if (Object.keys(helpers[name]).length != 0) {
                let totalJob = findTimes(helpers[name].jobBegin, helpers[name].jobEnd)
                let totalTravel = findTimes(helpers[name].travelBegin, helpers[name].travelEnd)
                helpersParsedData.push([name, totalJob, totalTravel, helpers[name]])
            }
        }
    }

    let mappedHelpers = helpersParsedData.map((worker, i) => {
        let workersList = Object.keys(helpers)
        let totalMins = (worker[1].mins ? worker[1].mins : 0) + (worker[2].mins ? worker[2].mins : 0)
        const minutes = totalMins % 60
        const hours = Math.floor(totalMins / 60);
        return (
            <tr className='helperInfoLine'>
                <td> <Input
                    autoComplete="on"
                    list='workers'
                    name='helper'
                    id={worker[0]}
                    onChange={(e) => handleChange(e, i)}
                    value={workersList[i]} />
                    <datalist id="workers">
                        <option value='Pat' />
                        <option value='Kyle' />
                        <option value='Rilyn' />
                        <option value='Gordon' />
                    </datalist>
                </td>
                <td> <Input
                    name='travelBegin'
                    onChange={(e) => changeTimes(e, worker[0], 'travelBegin',)}
                    type='time'
                    value={worker[3].travelBegin} />  -
                    <Input
                        name='travelEnd'
                        onChange={(e) => changeTimes(e, worker[0], 'travelEnd')}
                        type='time' value={worker[3].travelEnd} />
                </td>
                <td>
                    <Input
                        name='jobBegin'
                        onChange={(e) => changeTimes(e, worker[0], 'jobBegin')}
                        type='time'
                        value={worker[3].jobBegin} /> -
                    <Input
                        name='jobEnd'
                        onChange={(e) => changeTimes(e, worker[0], 'jobEnd')}
                        type='time'
                        value={worker[3].jobEnd} /> </td>
                <td> {hours}hr. {minutes}.min</td>
                <td>
                    <Input
                        name='milage'
                        onChange={(e) => changeTimes(e, worker[0], 'milage')}
                        value={worker[3].milage} />
                </td>
            </tr>
        )
    })

    const mappedjobInfo = props.editedData.jobInfo.map((row, index) => {
        return (
            <tr className='jobInfoLine'>
                <td><Input name='infoRow' onChange={(e) => handleChange(e, index, 'qty', e.target.value)} value={row.qty} />  </td>
                <td><Input name='infoRow' onChange={(e) => handleChange(e, index, 'length', e.target.value)} value={row.length} />  </td>
                <td><Input name='infoRow' onChange={(e) => handleChange(e, index, 'depth', e.target.value)} value={row.depth} />  </td>
                <td><Input name='infoRow' onChange={(e) => handleChange(e, index, 'workCode', e.target.value)} value={row.workCode} />  </td>
                <td><Input name='infoRow' type='textarea' onChange={(e) => handleChange(e, index, 'equipUsed', e.target.value)} value={row.equipUsed} />  </td>
                <td>
                    <Input
                        name='infoRow'
                        onChange={(e) => handleChange(e, index, 'serialNum', e.target.value)}
                        value={row.serialNum}
                        autoComplete="on"
                        list="serialNums"
                        type="text"
                    />
                    <datalist id="serialNums">
                        {serialNumsList.map((serialNum) => (
                            <option value={serialNum} key={serialNum} />
                        ))}
                    </datalist>
                </td>
            </tr>
        )
    })

    return (
        <div className='editComponent'>
            <div className='editAdminSection'>
                <div>
                    <Label>Truck #</Label>
                    <Input name='truckNum' onChange={(e) => handleChange(e)} value={props.editedData.truckNum} />
                </div>
                <div>
                    <Label>Customer</Label>
                    <Input name='billTo' onChange={(e) => handleChange(e)} value={props.editedData.billTo} />
                </div>
                <div>
                    <Label>Address</Label>
                    <Input name='address' onChange={(e) => handleChange(e)} value={props.editedData.address} />
                </div>
            </div>
            <div className='editWorkCompletedSection'>
                <Table
                    title='Work Completed'
                    bordered
                    size='sm'
                    responsive
                    striped
                >
                    <thead>
                        <tr>
                            <th>QTY</th>
                            <th>Length / DIA</th>
                            <th>Depth (in.)</th>
                            <th>Work Code</th>
                            <th>Description / Equip. Used</th>
                            <th>Blade serial #</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedjobInfo}
                    </tbody>
                </Table>
            </div>
            <div className='editTimeSection'>
                <Table
                    bordered
                    size='sm'
                    responsive
                    striped
                >
                    <thead>
                        <tr id='timeTitleContainer'>
                            <th>Name</th>
                            <th>Travel time</th>
                            <th>Job Time</th>
                            <th>Total Time</th>
                            <th>Milage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id='timeContentContainer'>
                            <td>
                                <Input
                                    className='editTimeInputs'
                                    name='worker'
                                    onChange={(e) => handleChange(e)}
                                    value={props.editedData.worker}
                                    list='workers'
                                    autoComplete='on'
                                />
                            </td>
                            <td className=''>
                                <Input name='travelBegin' onChange={(e) => handleChange(e)} type='time' value={props.editedData.travelBegin} /> -
                                <Input name='travelEnd' onChange={(e) => handleChange(e)} type='time' value={props.editedData.travelEnd} />
                            </td>
                            <td className=''>
                                <Input name='jobBegin' onChange={(e) => handleChange(e)} type='time' value={props.editedData.jobBegin} /> -
                                <Input name='jobEnd' onChange={(e) => handleChange(e)} type='time' value={props.editedData.jobEnd} />
                            </td>
                            <td className=''>{props.editedData.totalPaidTime}</td>
                            <td>
                                <Input className='' name='milage' onChange={(e) => handleChange(e)} value={props.editedData.milage} />
                            </td>
                        </tr>
                        {mappedHelpers}
                    </tbody>
                </Table>
            </div >
            <div className='editOtherWorkSection'>
                <div className='editConfirmationContainer'>
                    <div className=''>
                        <Label>PO Number</Label>
                        <Input placeholder='PO number' name='poNum' onChange={(e) => handleChange(e)} value={props.editedData.poNum} />
                    </div>
                    <div className=''>
                        <Label>Job Number</Label>
                        <Input placeholder='Job Number' name='jobNum' onChange={(e) => handleChange(e)} value={props.editedData.jobNum} />
                    </div>
                    <div className=''>
                        <Label>Emailed To</Label>
                        <Input placeholder='CC' name='CC' onChange={(e) => handleChange(e)} value={props.editedData.CC} />
                    </div>
                    <div className='editConfirmationMsg'>
                        I {props.editedData.confirmationName} have read and agreed to the details and conditions of the job ticket above on behalf of <span id='customer'>{props.editedData.billTo.toLocaleUpperCase()}</span>.
                    </div>
                </div>
                <div className='timeBreakdownContainer'>
                    <div className='grayed editInputGroup'>
                        <Label>Wall Sawing</Label>
                        <Input placeholder='-' name='wallSawing' onChange={(e) => handleChange(e)} type='number' value={props.editedData.wallSawing} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Core Drilling</Label>
                        <Input placeholder='-' name='coreDrilling' onChange={(e) => handleChange(e)} type='number' value={props.editedData.coreDrilling} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Water Control</Label>
                        <Input placeholder='-' name='waterControl' onChange={(e) => handleChange(e)} type='number' value={props.editedData.waterControl} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Slab Saw</Label>
                        <Input placeholder='-' name='slabSaw' onChange={(e) => handleChange(e)} type='number' value={props.editedData.slabSaw} />
                    </div>
                    <div className='grayed editInputGroup'>
                        <Label>Hand Saw</Label>
                        <Input placeholder='-' name='handSawing' onChange={(e) => handleChange(e)} type='number' value={props.editedData.handSawing} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Hammer Chipping</Label>
                        <Input placeholder='-' name='hammerChipping' onChange={(e) => handleChange(e)} type='number' value={props.editedData.hammerChipping} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Load Excevate</Label>
                        <Input placeholder='-' name='loadExcevating' onChange={(e) => handleChange(e)} type='number' value={props.editedData.loadExcevate} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Haul</Label>
                        <Input placeholder='-' name='haul' onChange={(e) => handleChange(e)} type='number' value={props.editedData.haul} />
                    </div>
                    <div className='grayed editInputGroup'>
                        <Label>Hand Labor</Label>
                        <Input placeholder='-' name='handLabor' onChange={(e) => handleChange(e)} type='number' value={props.editedData.handLabor} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Dump Yards</Label>
                        <Input placeholder='-' name='dumpYards' onChange={(e) => handleChange(e)} type='number' value={props.editedData.dumpYards} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Release</Label>
                        <Input placeholder='-' name='release' onChange={(e) => handleChange(e)} type='number' value={props.editedData.release} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Standby</Label>
                        <Input placeholder='-' name='standby' onChange={(e) => handleChange(e)} type='number' value={props.editedData.standby} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Other</Label>
                        <Input placeholder='-' name='other' onChange={(e) => handleChange(e)} type='number' value={props.editedData.other} />
                    </div>

                    <div className='grayed editInputGroup'>
                        <Label>Down Time</Label>
                        <Input placeholder='-' name='downtime' onChange={(e) => handleChange(e)} type='number' value={props.editedData.downTime} />
                    </div>
                </div>
            </div>
        </div >
    )
});

export default EditTicket;
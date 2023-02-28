import axios from 'axios';
import { useState, useEffect } from 'react';
import { Input, Label, Table } from 'reactstrap';

const EditComponent = ((props) => {
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
            .get(`${props.API_URL}serialNum/numsList`)
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
                <td><Input name='infoRow' onChange={(e) => handleChange(e, index, 'equipUsed', e.target.value)} value={row.equipUsed} />  </td>
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
        <div onSubmit={() => props.handleSubmit(props.editedData)} className={props.editMode ? 'show' : 'hide'} id={props.editMode ? 'ticketBody' : 'hide'}>
            <section className='half' id='left'>
                <h3 >Job Information:</h3>
                <ul id='input name = onChange={(e) => handleChange(e)}Container'>
                    <Table
                        size='sm'
                        bordered
                        striped
                    >
                        <thead>
                            <tr>
                                <th>Truck #</th>
                                <th>Customer</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><Input name='truckNum' onChange={(e) => handleChange(e)} value={props.editedData.truckNum} /></td>
                                <td id='customer'><Input name='billTo' onChange={(e) => handleChange(e)} value={props.editedData.billTo} /></td>
                                <td><Input name='address' onChange={(e) => handleChange(e)} value={props.editedData.address} /></td>
                            </tr>
                        </tbody>
                    </Table>
                    <li><span className='input Item'>Work Completed</span>:
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
                    <li> <span className='input Item'>CA men on the job and their times.</span>
                        <Table
                            size='sm'
                            bordered
                            striped>
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
                                <tr>
                                    <td>
                                        <Input
                                            name='worker'
                                            onChange={(e) => handleChange(e)}
                                            value={props.editedData.worker} 
                                            list='workers'
                                            autoComplete='on'
                                            />
                                    </td>
                                    <td><><Input name='travelBegin' onChange={(e) => handleChange(e)} type='time' value={props.editedData.travelBegin} /> - <Input name='travelEnd' onChange={(e) => handleChange(e)} type='time' value={props.editedData.travelEnd} /> </> </td>
                                    <td><><Input name='jobBegin' onChange={(e) => handleChange(e)} type='time' value={props.editedData.jobBegin} /> - <Input name='jobEnd' onChange={(e) => handleChange(e)} type='time' value={props.editedData.jobEnd} /> </></td>
                                    <td>{props.editedData.totalPaidTime}</td>
                                    <td><Input name='milage' onChange={(e) => handleChange(e)} value={props.editedData.milage} /></td>
                                </tr>
                                {mappedHelpers}
                            </tbody>
                        </Table>
                    </li>

                </ul>
                <h3>Other Job Details</h3>
                <Input name='detailsNotCovered' onChange={(e) => handleChange(e)} type='textarea' value={props.editedData.detailsNotCovered} />

                <section id='confirmationDetails'>
                    <ul>
                        <li>
                            <Label>PO #:</Label>
                            <Input name='poNum' onChange={(e) => handleChange(e)} value={props.editedData.poNum} />
                        </li>
                        <li>
                            <Label>Job #:</Label>
                            <Input name='jobNum' onChange={(e) => handleChange(e)} value={props.editedData.jobNum} />
                        </li>
                        <li>
                            <Label>Email CC:</Label>
                            <Input name='CC' onChange={(e) => handleChange(e)} value={props.editedData.CC} />
                        </li>
                    </ul>
                    I {props.editedData.confirmationName} have read and agreed to the details and conditions of the job ticket above on behalf of <span id='customer'>{props.editedData.billTo.toLocaleUpperCase()}</span>.
                </section>
            </section>

            <section className='half' id='right'>
                <Table
                    bordered
                    size="sm"
                    striped
                >
                    <thead>
                        <tr>
                            <th>Hours Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr> <th>
                            <Label>Wall Sawing</Label>
                            <Input name='wallSawing' onChange={(e) => handleChange(e)} type='number' value={props.editedData.wallSawing} />
                        </th></tr>

                        <tr> <th>
                            <Label>Core Drilling</Label>
                            <Input name='coreDrilling' onChange={(e) => handleChange(e)} type='number' value={props.editedData.coreDrilling} />
                        </th></tr>

                        <tr> <th>
                            <Label>Water Control</Label>
                            <Input name='waterControl' onChange={(e) => handleChange(e)} type='number' value={props.editedData.waterControl} />
                        </th></tr>

                        <tr> <th>
                            <Label>Slab Saw</Label>
                            <Input name='slabSaw' onChange={(e) => handleChange(e)} type='number' value={props.editedData.slabSaw} />
                        </th></tr>

                        <tr> <th>
                            <Label>Hammer Chipping</Label>
                            <Input name='hammerChipping' onChange={(e) => handleChange(e)} type='number' value={props.editedData.hammerChipping} />
                        </th></tr>

                        <tr> <th>
                            <Label>Load Excevate</Label>
                            <Input name='loadExcevating' onChange={(e) => handleChange(e)} type='number' value={props.editedData.loadExcevate} />
                        </th></tr>

                        <tr> <th>
                            <Label>Haul</Label>
                            <Input name='haul' onChange={(e) => handleChange(e)} type='number' value={props.editedData.haul} />
                        </th></tr>

                        <tr> <th>
                            <Label>Hand Labor</Label>
                            <Input name='handLabor' onChange={(e) => handleChange(e)} type='number' value={props.editedData.handLabor} />
                        </th></tr>

                        <tr> <th>
                            <Label>Dump Yards</Label>
                            <Input name='dumpYards' onChange={(e) => handleChange(e)} type='number' value={props.editedData.dumpYards} />
                        </th></tr>

                        <tr> <th>
                            <Label>Release</Label>
                            <Input name='release' onChange={(e) => handleChange(e)} type='number' value={props.editedData.release} />
                        </th></tr>

                        <tr> <th>
                            <Label>Standby</Label>
                            <Input name='standby' onChange={(e) => handleChange(e)} type='number' value={props.editedData.standby} />
                        </th></tr>

                        <tr> <th>
                            <Label>Other</Label>
                            <Input name='other' onChange={(e) => handleChange(e)} type='number' value={props.editedData.other} />
                        </th></tr>

                        <tr> <th>
                            <Label>Down Time</Label>
                            <Input name='downtime' onChange={(e) => handleChange(e)} type='number' value={props.editedData.downTime} />
                        </th></tr>
                    </tbody>
                </Table>

            </section>
        </div>
    )
});

export default EditComponent;
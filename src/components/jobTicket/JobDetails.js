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
                {props.value['travelTotal'] && props.value['travelTotal'] !== 0 ? <li>{props.value['travelTotal'] * 30}min were spent traveling for this job.</li> : ''}
                {props.value['jobTotal'] && props.value['jobTotal'] !== 0 ? <li>{props.value['jobTotal'] * 30}min were spent on the job site working.</li> : ''}
                {props.value.wallSawing ? <li>{`Wall sawing took ${props.value.wallSawing * 30}min.`}</li> : ''}
                {props.value.coreDrilling ? <li>{`Core drilling took ${props.value.coreDrilling * 30}min.`}</li> : ''}
                {props.value.waterControl ? <li>{`Water control took ${props.value.waterControl * 30}min.`}</li> : ''}
                {props.value.slabSaw ? <li>{`Slab sawing took ${props.value.slabSaw * 30}min.`}</li> : ''}
                {props.value.hammerChipping ? `Jack hammer chipping took ${props.value.hammerChipping * 30}min.` : ''}
                {props.value.loadExcevate ? <li>{`Load excevate took ${props.value.loadExcevate * 30}min.`}</li> : ''}
                {props.value.haul ? <li>{`Hauling took ${props.value.haul * 30}min.`}</li> : ''}
                {props.value.handLabor ? <li>{`Hand labor took ${props.value.handLabor * 30}min.`}</li> : ''}
                {props.value.dumpYards ? <li>{`Dump yards took ${props.value.dumpYards * 30}min.`}</li> : ''}
                {props.value.release ? <li>{`Releases took ${props.value.release * 30}min.`}</li> : ''}
                {props.value.standby ? <li>{`Standby took ${props.value.standby * 30}min.`}</li> : ''}
                {props.value.other ? `other time took ${props.value.other * 30}min.` : ''}
                {props.value.downTime ? <li>{`Down time took ${props.value.downTime * 30}min.`}</li> : ''}
            </ul>
        </section>

        <section id='legalDisclaimer'>
            <h2> Standard job conditions:</h2>
            <ul>
                <li>1. Layout of work by others prior to arrival of operator.</li>
                <li>2. We cannot accept responsibility for damage to buried objects such as conduit, steel pipes, etc.</li>
                <li>3. All prices based on a maximum work height of 8???. Scaffolding supplied and erected by others unless prior arrangements are made.</li>
                <li>4. Water and power available within 150??? of work area. Parking for truck and power unit within 150??? of work area.</li>
                <li>5. Traffic control, water and/or dust partition by others.</li>
                <li>6. We reserve the right to bill all work on an hourly basis due to difficult working conditions and/or heavy reinforcing.</li>
                <li>7. If for any reason are unable to work due to no fault of our own, then we must charge for stand-by time.</li>
                <li>8. Contractor is responsible for covering holes created by sawing and drilling.</li>
                <li>9. In the event of non-payment of any amount, when due, purchaser agrees to pay all collection costs including reasonable attorney fees.</li>
            </ul>
        </section>
    </div>
)
}

export default JobDetails;
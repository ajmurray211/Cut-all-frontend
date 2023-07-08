import React from 'react';
import { Document, Page, Text, Image, StyleSheet, View } from '@react-pdf/renderer';
import cutallLogo from '../Assets/cut-all-logo.png';
import { useFindTimeDiff } from '../hooks/useFindTimeDiff';

const PdfRenderer = (props) => {
    const { findTimes } = useFindTimeDiff()
    const taskData = [
        { label: 'Wall sawing', value: props.value.wallSawing },
        { label: 'Core drilling', value: props.value.coreDrilling },
        { label: 'Water control', value: props.value.waterControl },
        { label: 'Slab sawing', value: props.value.slabSaw },
        { label: 'Hand sawing', value: props.value.handSawing },
        { label: 'Jack hammer chipping', value: props.value.hammerChipping },
        { label: 'Load excevate', value: props.value.loadExcevate },
        { label: 'Hauling', value: props.value.haul }, 
        { label: 'Hand labor', value: props.value.handLabor },
        { label: 'Dump yards', value: props.value.dumpYards },
        { label: 'Releases', value: props.value.release },
        { label: 'Standby', value: props.value.standby },
        { label: 'Other time', value: props.value.other },
        { label: 'Down time', value: props.value.downTime },
    ];

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        logo: {
            width: 100,
            height: 100,
        },
        section: {
            marginTop: 20,
        },
        table: {
            display: 'table',
            width: '100%',
            borderWidth: 1,
            borderColor: '#000',
        },
        tableRow: {
            flexDirection: 'row',

        },
        tableCell: {
            flex: 1,
            padding: 5,
            fontSize: 10,

        },
        columnHeader: {
            fontWeight: 'bold',
            fontSize: 12,
        },
        ticketLogo: {
            height: 50,
            width: 60,
        },
        customer: {
            fontWeight: 700,
            fontWeight: 'bold',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontFamily: 'Arial, Helvetica, sans-serif',
        },
        tableHead: {
            backgroundColor: '#f0f0f0'
        },
        logoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
        },
        logo: {
            width: 100,
            height: 100,
            marginRight: 10,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        heading: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        listItem: {
            marginBottom: 5,
            fontSize: 10
        },
        disclaimer: {
            marginTop: 20,
        },
        paragraph: {
            fontSize: 10,
            marginBottom: 10,
        },
    });

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

    const mappedTasks = taskData
        .filter((task) => task.value)
        .map((task, index) => (
            <Text style={{ ...styles.tableRow, backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F0F0F0', }} key={index}>
                <Text style={{ fontWeight: 'bold' }}>{task.label}:</Text> {`${task.value} hrs.`}
            </Text>
        ));

    const halfLength = Math.ceil(mappedTasks.length / 2);
    const tasksColumn1 = mappedTasks.slice(0, halfLength);
    const tasksColumn2 = mappedTasks.slice(halfLength);

    const mappedHelpers = helpersParsedData.map((worker, index) => {
        let totalMins = (worker[1].mins ? worker[1].mins : 0) + (worker[2].mins ? worker[2].mins : 0);
        const minutes = totalMins % 60;
        const hours = Math.floor(totalMins / 60);
        const backgroundColor = index % 2 !== 0 ? '#ffffff' : '#f0f0f0';

        return (
            <View style={{ ...styles.tableRow, backgroundColor }} key={worker[0]}>
                <Text style={styles.tableCell}>{worker[0]}</Text>
                <Text style={styles.tableCell}>{worker[3].travelBegin} - {worker[3].travelEnd}</Text>
                <Text style={styles.tableCell}>{worker[3].jobBegin} - {worker[3].jobEnd}</Text>
                <Text style={styles.tableCell}>{hours}hr. {minutes}min</Text>
                <Text style={styles.tableCell}>{worker[3].milage}</Text>
            </View>
        );
    });


    const mappedjobInfo = props.value.jobInfo.map((row, index) => {
        const backgroundColor = index % 2 === 0 ? '#ffffff' : '#f0f0f0';
        return (
            <View key={index} style={{ ...styles.tableRow, backgroundColor }}>
                <Text style={styles.tableCell}>{row.qty}</Text>
                <Text style={styles.tableCell}>{row.length}</Text>
                <Text style={styles.tableCell}>{row.depth}</Text>
                <Text style={styles.tableCell}>{row.workCode}</Text>
                <Text style={styles.tableCell}>{row.equipUsed}</Text>
                <Text style={styles.tableCell}>{row.serialNum}</Text>
            </View>
        )
    });

    return (
        <Document>
            <Page size="A4" scale={0.7}>
                <View style={styles.container}>

                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} src={cutallLogo} />
                        <Text style={styles.title}>Cutall Concrete Ticket #{props.value.ticketNum}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text>Job Information:</Text>
                        <View style={styles.table}>
                            <View style={{ ...styles.tableRow, ...styles.tableHead }}>
                                <Text style={styles.tableCell}>Truck #</Text>
                                <Text style={styles.tableCell}>Date</Text>
                                <Text style={styles.tableCell}>Customer</Text>
                                <Text style={styles.tableCell}>Address</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>{props.value.truckNum}</Text>
                                <Text style={styles.tableCell}>{props.value.date}</Text>
                                <Text style={styles.tableCell} id='customer'>
                                    {props.value.billTo.toLocaleUpperCase()}
                                </Text>
                                <Text style={styles.tableCell}>{props.value.address}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text>Work Completed:</Text>
                        <View style={styles.table}>
                            <View style={{ ...styles.tableRow, ...styles.tableHead }}>
                                <Text style={styles.tableCell}>QTY</Text>
                                <Text style={styles.tableCell}>Length / DIA</Text>
                                <Text style={styles.tableCell}>Depth (in.)</Text>
                                <Text style={styles.tableCell}>Work Code</Text>
                                <Text style={styles.tableCell}>Description / Equip. Used</Text>
                                <Text style={styles.tableCell}>Blade serial #</Text>
                            </View>
                            {mappedjobInfo}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text>CA men on the job and their times:</Text>
                        <View style={styles.table}>
                            <View style={{ ...styles.tableRow, ...styles.tableHead }}>
                                <Text style={styles.tableCell}>Name</Text>
                                <Text style={styles.tableCell}>Travel Time</Text>
                                <Text style={styles.tableCell}>Job Time</Text>
                                <Text style={styles.tableCell}>Total Time</Text>
                                <Text style={styles.tableCell}>Milage</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>{props.value.worker}</Text>
                                <Text style={styles.tableCell}>{props.value.travelEnd ? `${props.value.travelBegin} - ${props.value.travelEnd}` : '-'}</Text>
                                <Text style={styles.tableCell}>{props.value.jobEnd ? `${props.value.jobBegin} - ${props.value.jobEnd}` : '-'}</Text>
                                <Text style={styles.tableCell}>{props.value.totalPaidTime}</Text>
                                <Text style={styles.tableCell}>{props.value.milage}</Text>
                            </View>
                            {mappedHelpers}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text>Task Durations:</Text>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>{tasksColumn1}</View>
                            <View style={styles.tableCell}>{tasksColumn2}</View>
                        </View>
                    </View>

                    {props.value.detailsNotCovered && (
                        <View style={styles.section}>
                            <Text style={styles.heading}>Other Job Details</Text>
                            <Text style={styles.paragraph}>{props.value.detailsNotCovered}</Text>
                        </View>
                    )}

                    <View style={styles.section} id="confirmationDetails">
                        <Text style={styles.heading}>Confirmation Details:</Text>
                        <View style={styles.table}>
                            <View style={{ ...styles.tableRow, ...styles.tableHead }}>
                                <Text style={styles.tableCell}>
                                    PO #: {props.value.poNum && props.value.poNum !== null ? props.value.poNum : 'None'}
                                </Text>
                                <Text style={styles.tableCell}>
                                    Job #: {props.value.jobNum && props.value.jobNum !== null ? props.value.jobNum : 'None'}

                                </Text>
                                <Text style={styles.tableCell}>
                                    Emailed to: {props.value.CC && props.value.CC !== null ? props.value.CC : 'None'}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.confirmationSection}>
                                I {props.value.confirmationName} have read and agreed to the details and conditions of the job ticket
                                above on behalf of <Text >{props.value.billTo.toLocaleUpperCase()}.</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>

            <Page size="A4" scale={0.7}>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.heading}>Standard job conditions:</Text>
                        <View style={styles.listItem}>
                            <Text>1. Layout of work by others prior to arrival of operator.</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>
                                2. We cannot accept responsibility for damage to buried objects such as conduit, steel pipes, etc.
                            </Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>
                                3. All prices based on a maximum work height of 8’. Scaffolding supplied and erected by others unless
                                prior arrangements are made.
                            </Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>
                                4. Water and power available within 150’ of work area. Parking for truck and power unit within 150’ of
                                work area.
                            </Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>5. Traffic control, water and/or dust partition by others.</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>
                                6. We reserve the right to bill all work on an hourly basis due to difficult working conditions and/or
                                heavy reinforcing.
                            </Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>7. If for any reason we are unable to work due to no fault of our own, then we must charge for stand-by time.</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>8. Contractor is responsible for covering holes created by sawing and drilling.</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text>
                                9. In the event of non-payment of any amount, when due, purchaser agrees to pay all collection costs
                                including reasonable attorney fees.
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PdfRenderer;


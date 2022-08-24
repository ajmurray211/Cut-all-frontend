import { Button, Collapse, Card, CardBody } from "reactstrap";
import { useState } from "react";

const Part = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen);

    const mappedLastDrawNames = (props.part.drawList).map((info) => {
        // if (!info && info == undefined) {
        //     return <li>No current draw list data.</li>
        // }
        return (
            <li style={{ fontSize: 20 }}>{info.name} took <span style={{ color: 'red' }}>{info.amountTaken}</span> on <span style={{ color: 'blue' }}>{info.dateTaken}</span>.</li>
        )
    })

    return (
        <>
        <li className="part">
            <section id="partName" className="item">
                Part Name: {props.part.name}
            </section>
            <section id="partsOnHand" className="item">
                On hand count: {props.part.onHand}
            </section>
            <section id="partLastPerson" className="item">
                <p>Last person to draw: {props.part.drawList.at(-1).name}</p>
                {/* {props.part.drawList.at(-1).name ? <p>Last person to draw: {props.part.drawList.at(-1).name}</p> : <p>No Name</p> } */}
            </section>
            <Button
                color="primary"
                onClick={toggle}
            >
            Details
            </Button>
        </li>
        <Collapse className="part-collapse" isOpen={isOpen}>
            <Card>
                <h4 style={{ fontSize: 27, marginTop: 10 }}>History of who has pulled {props.part.name}:</h4>
                <CardBody className="detail-cards">
                    <ul className="lastdrawednames">
                        {mappedLastDrawNames}
                    </ul>
                </CardBody>
            </Card>
        </Collapse>
       </>
    );
}

export default Part;
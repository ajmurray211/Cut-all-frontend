import { Button, Collapse, Card, CardBody } from "reactstrap";
import { useState } from "react";

const Part = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen);

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
                Last person to draw: (props.part.workerKey when operational)
            </section>
            <Button
                color="primary"
                onClick={toggle}
            >
            Details
            </Button>
        </li>
        <Collapse isOpen={isOpen}>
            <Card>
                <CardBody>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                    terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                    labore wes anderson cred nesciunt sapiente ea proident.
                </CardBody>
            </Card>
        </Collapse>
       </>
    );
}

export default Part;
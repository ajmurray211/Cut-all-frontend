import { Button, UncontrolledCollapse, Card, CardBody } from "reactstrap";

const Part = (props) => {
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
                id="toggler"
            >
            Details
            </Button>
            <UncontrolledCollapse toggler="#toggler">
                <Card>
                    <CardBody>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni, voluptas debitis similique porro a molestias consequuntur earum odio officiis natus, amet hic, iste sed dignissimos esse fuga! Minus, alias.
                    </CardBody>
                </Card>
            </UncontrolledCollapse>
        </li>
       </>
    );
}

export default Part;
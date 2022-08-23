const Part = (props) => {
    return (
        <li className="part">
            <section id="partName" className="item">
                Part Name: {props.part.name}
            </section>
            <section id="partsOnHand" className="item">
                On hand count: {props.part.onHand}
            </section>
        </li>);
}

export default Part;
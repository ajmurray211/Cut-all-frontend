const Part = (props) => {
    console.log(props)
    return (
        <li>
            <section>
                Part Name: {props.part.name}
            </section>
            <section>
                On hand count: {props.part.onHand}
            </section>
        </li>);
}

export default Part;
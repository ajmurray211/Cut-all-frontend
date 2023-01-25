import { Label, FormGroup, Input } from 'reactstrap';
import TicketInfo from './TicketInfo';

const JobDetails = (props) => {
    return(
        <div>
            <TicketInfo
            value={props.value}
            />
            <FormGroup>
                <Label for='CC'>Contractor email:</Label>
                <Input id='CC' type='text' name='CC' onChange={props.handleChange} />
                <br></br>
                <Label for='CC'>PO number:</Label>
                <Input id='CC' type='text' name='poNum' onChange={props.handleChange} />
                <br></br>
                <Label for='CC'>Job number:</Label>
                <Input id='CC' type='text' name='jobNum' onChange={props.handleChange} />
                <br></br>
                <Input id='confirmation' type='checkbox' onChange={(e) => console.log(e.target.checked)} />
                <Label for="confirmation">
                    :I have reviewed the above information and confirm the information is correct.
                </Label>
                <br></br>
                <Label for="confirmationName">
                    Typing your name acts as an e-signature:
                </Label>
                <Input type='text' name='confirmationName' id='confirmationName' onChange={props.handleChange} />
            </FormGroup>
        </div>
    )
}

export default JobDetails;
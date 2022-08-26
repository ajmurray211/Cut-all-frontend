import './jobTicket.css'
import SignatureCanvas from 'react-signature-canvas'

const JobTIcket = () => {
    return (
        <div>
            <h1>Ticket Page</h1>
            <div id='sign'>
                <SignatureCanvas penColor='black' id='sign'
                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
            </div>
                <h2>hi</h2>
        </div>
    );
}

export default JobTIcket;
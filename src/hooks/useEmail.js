import { useState } from "react"
import emailjs from '@emailjs/browser';

export const useEmail = () => {
    const [success, setSuccess] = useState(false)
    const [status, setStatus] = useState('')
    const [fail, setFail] = useState(false)
    const [loading, setLoading] = useState(false)
    const [template, setTemplate] = useState(
        process.env.NODE_ENV === "production"
            ? 'template_mdw8cd7' //prod email
            : 'template_jxp3a6n' // test email
    );

    const sendEmail = async (service, value, repID, pdfBlob) => {

        const attachment = {
            name: "ticket.pdf",
            data: pdfBlob,
        };

        console.log(template)


        setLoading(true)
        await emailjs.send(service, template, {value, pdfBlob}, repID)
            .then((result) => {
                setLoading(false)
                setStatus(result.text);
                setSuccess(true)
            }, (error) => {
                setLoading(false)
                setFail(true)
                setStatus(error.text)
            });
    }
    
    return { sendEmail, status, success, loading, fail, setFail, setStatus, setSuccess }
}

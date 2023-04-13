import { useState } from "react"
import emailjs from '@emailjs/browser';

export const useEmail = () => {
    const [success, setSuccess] = useState(false)
    const [status, setStatus] = useState('')
    const [fail, setFail] = useState(false)
    const [loading, setLoading] = useState(false)

    const sendEmail = async (service, template, value, repID) => {
        setLoading(true)
        await emailjs.send(service, template, value, repID)
            .then((result) => {
                console.log(result)
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

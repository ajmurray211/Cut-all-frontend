import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = (props) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
    // const API_URL = 'http://localhost:8080/'

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        const respose = await fetch(`${API_URL}user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const json = await respose.json()

        if (!respose.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (respose.ok) {
            // save the user to local storage 
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })
            setIsLoading(false)
        }
    }
    return { login, isLoading, error }
} 
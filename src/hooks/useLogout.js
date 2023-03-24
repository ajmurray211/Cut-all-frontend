import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {
        // REMOVE USER FROM STROAGE
        localStorage.removeItem('user')

        // dispatch logout function
        dispatch({ type: "LOGOUT" })
    }
    return { logout }
}
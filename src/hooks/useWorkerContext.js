import { useContext } from 'react'
import { WorkersContext } from '../context/WorkerContext'

export const useWorkerContext = () => {
    const context = useContext(WorkersContext)

    if (!context) {
        throw Error('useWorkerContext must be used inside an WorkerContextProvider')
    }

    return context
}
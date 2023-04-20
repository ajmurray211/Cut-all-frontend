import { useState } from 'react'

export const useModal = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = async (email, password) => {
        setIsOpen(!isOpen)
    }

    return { toggleModal, isOpen }
} 
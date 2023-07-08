import { useState, useEffect } from 'react';

const useAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');

  const showAlert = (statusCode, message) => {
    setIsOpen(true);
    setAlertType(getAlertType(statusCode));
    setMessage(message);

    // Hide/reset the alert after 8 seconds
    setTimeout(() => {
      hideAlert();
    }, 8000);
  };

  const hideAlert = () => {
    setIsOpen(false);
    setAlertType('');
    setMessage('');
  };

  const getAlertType = (statusCode) => {
    if (statusCode.toString().startsWith('4')) {
      return 'danger';
    }
    return 'success';
  };

  return {
    isOpen,
    alertType,
    message,
    showAlert,
    hideAlert,
  };
};

export default useAlert;

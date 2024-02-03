import { useState, createContext } from "react";

export const errorMessageContext = createContext('');

export default function ErrorMessageContext(props) {
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <errorMessageContext.Provider value={[errorMessage, setErrorMessage]}>
            {props.children}
        </errorMessageContext.Provider>
    );
}

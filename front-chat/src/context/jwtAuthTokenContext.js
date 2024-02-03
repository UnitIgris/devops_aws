import { useState, createContext } from "react";

export const jwtAuthTokenContext = createContext('');

export default function JwtAuthTokenContext(props) {
    const [authToken, setAuthToken] = useState('');

    return (
        <jwtAuthTokenContext.Provider value={[authToken, setAuthToken]}>
            {props.children}
        </jwtAuthTokenContext.Provider>
    );
}

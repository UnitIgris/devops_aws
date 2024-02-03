import {useContext, useEffect, useState} from "react";
import {jwtAuthTokenContext} from "./context/jwtAuthTokenContext";
import {Navigate, useLocation} from "react-router-dom";
import Cookies from "js-cookie";

export default function NeedAuth(props) {
    const location = useLocation();
    const [authToken, setAuthToken] = useContext(jwtAuthTokenContext);
    const [checkedToken, setCheckedToken] = useState(false);

    useEffect(() => {
        if (!authToken) {
            const tokenFromCookie = Cookies.get('authToken');
            if (tokenFromCookie) {
                setAuthToken(tokenFromCookie);
                setCheckedToken(true);
            } else {
                setCheckedToken(true);
            }
        }
    }, [authToken, checkedToken, setAuthToken]);

    if (authToken || (props.optional && checkedToken)) {
        return props.children;
    } else if (checkedToken && !authToken) {
        return <Navigate to='/se-connecter' state={{ from: location }} />;
    }
}

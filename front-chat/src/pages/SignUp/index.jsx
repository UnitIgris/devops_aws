import React, { useContext, useState } from "react";
import { useSignUp } from "../../hooks/useApi";
import { errorMessageContext } from "../../context/errorMessageContext";
import { jwtAuthTokenContext } from "../../context/jwtAuthTokenContext";
import { Link, useNavigate } from "react-router-dom";
import "./styles/main.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [errorMessage, setErrorMessage] = useContext(errorMessageContext);
  // eslint-disable-next-line no-unused-vars
  const [authToken, setAuthToken] = useContext(jwtAuthTokenContext);
  const navigate = useNavigate();

  const RegisterFunction = (event) => {
    event.preventDefault();
    useSignUp({ email, password, lastname, firstname }).then((response) => {
 
      if (response.status !== 200) {
        setErrorMessage(response.message);
      } else {
        setErrorMessage("");
        setAuthToken(response.data.token);
        navigate("/");
      }
    }).catch(error => {
      setErrorMessage(error.response.data.message);
    });
  };

  return (
    <React.Fragment>
      <div className="login-page">
        <div className="container-login">
          <form className="col-log">
            <div className={"login-form card"}>
              <div className="card-body">
                <h1 className="title">Inscription</h1>
                <input
                  
                  placeholder="Prénom"
                  className={"input"}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                />
                <input
                   
                  placeholder="Nom"
                  className={"input"}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                />
                <input
                  type="email"
                  placeholder="Adresse mail"
                  className={"input"}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <input
                  placeholder="Mot de passe"
                  type="password"
                  className={"input"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {errorMessage && (
                  <p className={"error-message"}>{errorMessage}</p>
                )}
                <button
                  className={"submit-btn"}
                  onClick={(e) => RegisterFunction(e)}
                >
                  S'inscrire
                </button>
                <p className="go-sub">
                  <p>Vous avez déjà un compte ?</p>
                  <Link to={"/se-connecter"}>Connectez-vous !</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

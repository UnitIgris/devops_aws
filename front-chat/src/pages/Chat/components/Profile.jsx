import React, {useEffect, useState} from "react";
import {useGetUser, useUpdateProfile} from "../../../hooks/useApi";
import pp from "assets/images/default-pp.jpeg";

const Profile = ({ loggedInUserId, closeSidebar }) => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    GetProfile();
  }, []);

  const GetProfile = () => {
    useGetUser(loggedInUserId).then((response) => {
        setFirstName(response.data.data.firstname);
        setLastName(response.data.data.lastname);
        setEmail(response.data.data.email);
      });
  }

  const saveProfile = (event) => {
    event.preventDefault();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useUpdateProfile({ email, lastname, firstname }).then((response) => {
      if (response.status !== 200) {
        alert(response.message);
      } else {
		alert("Modification enregistré");
        closeSidebar();
      }
    });
  };

  return (
    <div className="profile">
      <div className="profile__section profile__section--personal">
        <div className="profile__avatar-wrapper">
          <img
            src={pp}
            alt={firstname}
            className="avatar"
          />
        </div>
        <h2 className="profile__name">
          {" "}
          {firstname} {lastname}{" "}
        </h2>
      </div>

      <div className="profile__section profile__section--about">
        <div className="sb profile__heading-wrapper">
          <h2 className="profile__heading"> Nom et adresse email </h2>
        </div>
        <ul>
          <input
            type={"text"}
            onChange={(e) => setFirstName(e.target.value)}
            className="profile__about-item"
            value={firstname}
            placeholder={"Prénom"}
          ></input>
          <input
            type={"text"}
            onChange={(e) => setLastName(e.target.value)}
            className="profile__about-item"
            value={lastname}
            placeholder={"Nom"}
          ></input>
          <input
            type={"email"}
            onChange={(e) => setEmail(e.target.value)}
            className="profile__about-item"
            value={email}
            placeholder={"Email"}
          ></input>
        </ul>
      </div>

     
      <button className="profile__section save-btn" onClick={saveProfile}>
        <p className="profile__danger-text"> Modifier </p>
      </button>
    </div>
  );
};

export default Profile;

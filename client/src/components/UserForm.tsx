import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledUserForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .myForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    width: 300px;
  }

  .myForm input {
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
  }

  .myForm button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    width: 100%;
    margin: 4px;
  }

  .myForm button:hover {
    background-color: #0056b3;
  }
`;

type UserFormState = {
  name: string;
};

type UserFormProps = {
  type: "add" | "edit";
  userId?: number;
};

const UserForm = (props: UserFormProps) => {
  const navigate = useNavigate();
  const [state, setState] = useState<UserFormState>({
    name: "",
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state: UserFormState) => ({
      ...state,
      name: e.target.value,
    }));
  };

  const navigateHome = () => {
    setState((state: UserFormState) => ({
      ...state,
      name: "",
    }));

    navigate("/");
  };

  const handleSubmit = async () => {
    if (props.type === "add") {
      try {
        const response = await axios.post("http://localhost:8080/newUser", {
          name: state.name,
        });

        navigateHome();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.put("http://localhost:8080/editUser", {
          name: state.name,
          id: props.userId,
        });

        navigateHome();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <StyledUserForm>
      <h1>{props.type === "add" ? "Add User" : "Edit User"}</h1>
      <div className="myForm">
        <input
          type="text"
          placeholder={props.type === "add" ? "Add User" : "Edit User"}
          onChange={handleNameChange}
          value={state.name}
        />

        <button type="button" onClick={handleSubmit}>
          {props.type === "add" ? "Add User" : "Save User"}
        </button>
        <button type="button" onClick={navigateHome}>
          Cancel
        </button>
      </div>
    </StyledUserForm>
  );
};

export default UserForm;

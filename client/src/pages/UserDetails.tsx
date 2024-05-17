import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserObject } from "./Home";
import axios from "axios";
import styled from "styled-components";
import UserForm from "../components/UserForm";

const StyledUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;    
    margin: 4px;
  }

  .myForm button:hover {
    background-color: #0056b3;
  }
`;

type UserDetailsState = {
  user: UserObject;
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<UserDetailsState>({
    user: {
      name: "",
      id: 0,
      p5Balance: 0,
      rewardBalance: 0,
    },
  });

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/userDetails/${id}`
      );
      setState((state: UserDetailsState) => ({
        ...state,
        user: response.data,
      }));
    } catch (error) {}
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <StyledUserDetails>
      <h1>User Details</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>P5 Balance</th>
            <th>Rewards Balance</th>
          </tr>
        </thead>

        <tbody>
          <td>{state.user.id}</td>
          <td>{state.user.name}</td>
          <td>{state.user.p5Balance}</td>
          <td>{state.user.rewardBalance}</td>
        </tbody>
      </table>

      <UserForm type="edit" userId={state.user.id} />

      <button
        onClick={() => {
          navigate(`/${id}/rewards/new`);
        }}
      >
        {" "}
        New Reward
      </button>
    </StyledUserDetails>
  );
};

export default UserDetails;

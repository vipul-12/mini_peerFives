import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledHome = styled.div`
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
    background-color: #3888e4;
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    cursor: pointer;
    color: #ffffff;
  }

  button:hover {
    background-color: #3888e4a1;
  }
`;

export type UserObject = {
  id: number;
  name: string;
  p5Balance: number;
  rewardBalance: number;
};

type HomeState = {
  users: UserObject[];
};

const Home = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<HomeState>({
    users: [],
  });

  const navigateToAddUser = () => {
    navigate("/addUser");
  };

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/");

      setState((state: HomeState) => ({
        ...state,
        users: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <StyledHome>
      <h1>Mini PeerFives</h1>
      {state.users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>P5 Balance</th>
              <th>Rewards Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.users.map((user: UserObject, index: number) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.p5Balance}</td>
                <td>{user.rewardBalance}</td>
                <td>
                  <button onClick={()=>{
                    navigate(`/${user.id}`)
                  }}>Login</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>No Users Found</>
      )}

      <div>
        <button onClick={navigateToAddUser}>Create User</button>
      </div>
    </StyledHome>
  );
};

export default Home;

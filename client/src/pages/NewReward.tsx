import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { UserObject } from "./Home";
import axios from "axios";

const StyledRewards = styled.div`
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

  .myForm input,
  select {
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

type FormData = {
  givenBy: number;
  givenTo: number;
  points: number;
};

type NewRewardState = {
  users: UserObject[];
  theForm: FormData;
};

const NewReward = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idNumber = id ? parseInt(id) : 0;
  const [state, setState] = useState<NewRewardState>({
    users: [],
    theForm: {
      givenBy: idNumber,
      givenTo: 0,
      points: 0,
    },
  });

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/");

      

      setState((state: NewRewardState) => ({
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

  const filteredUsers: UserObject[] = state.users.filter(
    (user) => user.id !== idNumber
  );

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newForm = state.theForm;
    newForm.points = parseInt(e.target.value);
    setState((state: NewRewardState) => ({
      ...state,
      theForm: newForm,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let newForm = state.theForm;
    newForm.givenTo = parseInt(e.target.value);
    setState((state: NewRewardState) => ({
      ...state,
      theForm: newForm,
    }));
  };

  const navigateHome = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/addRewardTransaction",
        state.theForm
      );
      navigateHome();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <StyledRewards>
      <h1>Reward A Friend</h1>

      <div className="myForm">
        <label>
          Select User:
          <select
            value={state.theForm.givenTo}
            defaultValue={filteredUsers.length > 0 ? filteredUsers[0].id : ""}
            onChange={handleSelectChange}
          >
            {filteredUsers.map((item: UserObject, index: number) => (
              <option key={index} value={item.id}>
                {item.id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Enter Amount:
          <input
            type="number"
            value={state.theForm.points}
            onChange={handlePointsChange}
            max={100}
          />
        </label>

        <button type="button" onClick={handleSubmit}>
          Submit
        </button>

        <button type="button" onClick={navigateHome}>
          Cancel
        </button>
      </div>
    </StyledRewards>
  );
};

export default NewReward;

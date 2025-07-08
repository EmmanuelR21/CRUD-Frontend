import React from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function SignUp() {
  const navigate = useNavigate();
  async function signUpUser(user, pass) {
    try {
      await axios.post("http://localhost:8080/auth/signup", {
        username: user,
        password: pass,
      });
      navigate("/");
    } catch (error) {
      if (error.response.data.error)
        console.error({ error: error.response.data.error });
      else console.error(error.message);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;

    signUpUser(username, password);
  }
  return (
    <form onSubmit={onSubmit}>
      <label>
        Username:
        <input type="text" name="username" />
      </label>
      <label>
        Password:
        <input type="text" name="password" />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
}

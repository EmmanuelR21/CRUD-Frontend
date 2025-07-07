import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";

export default function Login({ setAuthenticated }) {
  const navigate = useNavigate();
  async function loginUser(user, pass) {
    try {
      await axios.post(
        "http://localhost:8080/auth/login",
        {
          username: user,
          password: pass,
        },
        {
          withCredentials: true,
        },
      );
      setAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error({ error: error.message });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;

    loginUser(username, password);
  }

  return (
    <form onSubmit={handleSubmit}>
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

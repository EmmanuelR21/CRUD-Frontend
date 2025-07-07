import React from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function SignUp() {
  const navigate = useNavigate();
  async function signUpUser(user, pass) {
    try {
      await axios.post("http://localhost:8080/auth/signUp", {
        username: user,
        password: pass,
      });
      navigate("/");
    } catch (error) {
      console.error({ error: error.message });
    }
  }

  function onSubmit(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    signUpUser(username, password);
  }
  return (
    <form action={onSubmit}>
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

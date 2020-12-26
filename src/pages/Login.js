import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";

import { Button, Form } from "semantic-ui-react";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { handleChange, handleSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Login</h1>
        <Form.Input
          type="text"
          label="Username"
          placeholder="Username..."
          name="username"
          error={errors.username ? true : false}
          value={values.username}
          onChange={handleChange}
        />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Password..."
          name="password"
          error={errors.password ? true : false}
          value={values.password}
          onChange={handleChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;

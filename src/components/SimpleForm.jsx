import Joi from "joi";
import { useState } from "react";
import styles from "./SimpleForm.module.css";

function ErrorMessage({ message }) {
  return <span style={{ color: "red" }}>{message}</span>;
}

console.log("Stanley Test");

function SimpleForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });
  const [error, setError] = useState({});

  const baseSchema = {
    // will be of type string, with a minimum value of 1 and max of 20 and it cannot be empty
    name: Joi.string().min(1).max(20).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    age: Joi.number().min(1).max(100).required(),
  };

  const schema = Joi.object(baseSchema);

  /*
    Input box onChange handler + validation
  */

  const handlerOnChange = (event) => {
    const { name, value } = event.target;
    const errorMessage = validate(event);
    let errorData = { ...error };

    if (errorMessage) {
      errorData[name] = errorMessage;
    } else {
      delete errorData[name];
    }

    let userData = { ...user };
    userData[name] = value;

    setUser(userData);
    setError(errorData);
  };
  const validate = (event) => {
    // Insert validate function code here
    // const { name, value } = event.target;
    // const objToCompare = { [name]: value };
    // const subSchema = { [name]: schema[name] };

    const result = schema.validate(user);
    console.log("result", result);
    const { error } = result;
    return error ? error.details[0].message : null;
  };

  /*
    Submit handler
  */
  const handlerOnSubmit = (event) => {
    event.preventDefault();
    const result = schema.validate(user);
    const { error } = result;
    if (!error) {
      console.log(user);
      return user;
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      setError(errorData);
      console.log(errorData);
      return errorData;
    }
  };

  // console.log(import.meta.env.VITE_FEATURE_A, "env...");

  const shouldShowForm = import.meta.env.VITE_FEATURE_A === "true";

  console.log("shouldShowForm", shouldShowForm);

  return (
    <div className={styles.container}>
      <div>
        <h2>Environment Variable</h2>
        HELLO WORLD!!!! FROM SCTIP SOFTWARE
        {import.meta.env.MODE}
      </div>
      {shouldShowForm && (
        <>
          <h2>SimpleForm</h2>
          <form onSubmit={handlerOnSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              onChange={handlerOnChange}
            />
            <ErrorMessage message={error && error.name} />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              onChange={handlerOnChange}
            />
            <ErrorMessage message={error && error.email} />
            <label>Age:</label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              onChange={handlerOnChange}
            />
            <ErrorMessage message={error && error.age} />
            <button>Submit</button>
          </form>
        </>
      )}
    </div>
  );
}

export default SimpleForm;

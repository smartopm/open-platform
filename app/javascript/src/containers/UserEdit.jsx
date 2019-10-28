import React from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { withFormik } from "formik";
import { StyleSheet, css } from "aphrodite";
import { Button } from "@material-ui/core";
import Nav from "../components/Nav";
import UserForm from "../components/UserForm.jsx";
import Loading from "../components/Loading.jsx";
import crudHandler from "../graphql/crud_handler";

import { UserQuery } from "../graphql/queries";
import { UpdateUserMutation, CreateUserMutation } from "../graphql/mutations";

export default function UserFormContainer({ match, history }) {
  const { isLoading, error, result, createOrUpdate, loadRecord } = crudHandler({
    typeName: "user",
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(UpdateUserMutation),
    createMutation: useMutation(CreateUserMutation)
  });

  function submitMutation({
    name,
    userType,
    requestReason,
    vehicle,
    state,
    email,
    phoneNumber
  }) {
    console.log("Submit");
    return createOrUpdate({
      name,
      requestReason,
      userType,
      vehicle,
      state,
      email,
      phoneNumber
    });
  }

  const FormContainer = withFormik({
    mapPropsToValues: () => ({
      name: result.name,
      email: result.email || "",
      phoneNumber: result.phoneNumber || "",
      requestReason: result.requestReason || "",
      userType: result.userType,
      expiresAt: result.expiresAt || false,
      state: result.state,
      vehicle: result.vehicle || ""
    }),

    // Custom sync validation
    validate: values => {
      const errors = {};

      if (!values.name) {
        errors.name = "Required";
      }
      if (!values.userType) {
        errors.userType = "Required";
      }

      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      console.log("submit", values);
      submitMutation(values)
        .then(({ data }) => {
          console.log(data);
          setSubmitting(false);
          history.push(`/user/${data.result.user.id}`);
        })
        .catch(err => console.log(err));
    },

    displayName: "UserForm"
  })(Container);
  if (!isLoading && !result.id && !error) {
    loadRecord({ variables: { id: match.params.id } });
  } else if (isLoading) {
    return <Loading />;
  }
  return <FormContainer id={result.id} />;
}

export function Container(props) {
  let title = "New User";
  console.log(props);
  if (props && props.id) {
    title = "Editing User";
  }
  return (
    <div>
      <Nav
        navName={title}
        menuButton="edit"
        handleSubmit={props.handleSubmit}
      />
      <UserForm />
      {props && props.id ? (
        <div className="row justify-content-center align-items-center">
          <Button
            variant="contained"
            className={`btn ${css(styles.grantButton)}`}
          >
            Grant
          </Button>
          <Button
            variant="contained"
            className={`btn  ${css(styles.denyButton)}`}
          >
            Deny
          </Button>
        </div>
      ) : null}
    </div>
  );
}

Container.displayName = "UserForm";

const styles = StyleSheet.create({
  grantButton: {
    backgroundColor: "rgb(61, 199, 113)",
    color: "#FFF",
    marginRight: 60,
    width: "35%"
  },
  denyButton: {
    backgroundColor: "rgb(230, 63, 69)",
    color: "#FFF",
    width: "35%"
  }
});

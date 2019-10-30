import React from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { StyleSheet, css } from "aphrodite";
import { Button } from "@material-ui/core";
import Nav from "../components/Nav";
import UserForm from "../components/UserForm.jsx";
import Loading from "../components/Loading.jsx";
import crudHandler from "../graphql/crud_handler";
import { useFileUpload } from "../graphql/useFileUpload";
import { useApolloClient } from "react-apollo";
import { UserQuery } from "../graphql/queries";
import { UpdateUserMutation, CreateUserMutation } from "../graphql/mutations";
import { DenyModalDialog, GrantModalDialog } from "../components/Dialog";

const initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
  requestReason: "",
  userType: "",
  state: "",
  signedBlobId: "",
  imageUrl: ""
};

export const FormContext = React.createContext({
  values: initialValues,
  handleInputChange: () => {}
});

export default function FormContainer({ match, history }) {
  const { isLoading, error, result, createOrUpdate, loadRecord } = crudHandler({
    typeName: "user",
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(UpdateUserMutation),
    createMutation: useMutation(CreateUserMutation)
  });

  let title = "New User";
  if (result && result.id) {
    title = "Editing User";
  }
  const [data, setData] = React.useState(initialValues);
  const [isGrantOpen, setGrantModal] = React.useState(false);
  const [isDenyOpen, setDenyModal] = React.useState(false);
  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });

  function handleDenyModal() {
    setDenyModal(!isDenyOpen);
  }

  function handleGrantModal() {
    setGrantModal(!isGrantOpen);
  }
  function handleModalConfirm() {
    // grant the user here

    // closing the modal when done
    setDenyModal(!isDenyOpen);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const values = {
      ...data,
      avatarBlobId: signedBlobId
    };
    createOrUpdate(values)
      .then(({ data }) => {
        // setSubmitting(false);
        history.push(`/user/${data.result.user.id}`);
      })
      .catch(err => console.log(err));
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value
    });
  }

  // If we are in an edit flow and haven't loaded the data,
  // load the user data

  // If we are in an edit flow and have data loaded,
  // and it hasn't been merged with values, then
  // merge the result with the form 'data'
  //
  if (match.params.id) {
    if (isLoading) {
      return <Loading />;
    } else if (!result.id && !error) {
      loadRecord({ variables: { id: match.params.id } });
    } else if (!data.dataLoaded && result.id) {
      setData({
        ...result,
        dataLoaded: true
      });
    }
  }

  return (
    <FormContext.Provider
      value={{
        values: data || data,
        imageUrl: url,
        handleInputChange,
        handleSubmit,
        handleFileUpload: onChange,
        status
      }}
    >
      <Nav navName={title} menuButton="edit" />
      <DenyModalDialog
        handleClose={handleDenyModal}
        handleConfirm={handleModalConfirm}
        open={isDenyOpen}
      />
      <GrantModalDialog
        handleClose={handleGrantModal}
        handleConfirm={handleModalConfirm}
        open={isGrantOpen}
        imageURL={result.avatarUrl}
      />
      <UserForm />
      {result && result.id ? (
        <div className="row justify-content-center align-items-center">
          <Button
            variant="contained"
            onClick={handleGrantModal}
            className={`btn ${css(styles.grantButton)}`}
          >
            Grant
          </Button>
          <Button
            variant="contained"
            onClick={handleDenyModal}
            className={`btn  ${css(styles.denyButton)}`}
          >
            Deny
          </Button>
        </div>
      ) : null}
    </FormContext.Provider>
  );
}

FormContainer.displayName = "UserForm";

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

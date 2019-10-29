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
import { ModalDialog } from "../components/Dialog";


  const initialValues = {
      name: "", 
      email:  "", 
      phoneNumber:  "", 
      requestReason: "", 
      userType: "", 
      state:  "", 
      signedBlobId: "", 
      imageUrl:  "", 
    }

export const FormContext = React.createContext({ values: initialValues, handleInputChange: () => {} })


export default function FormContainer(props) {
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


  let title = "New User";
  if (result && result.id) {
    title = "Editing User";
  }
  const [data, setData] = React.useState(initialValues)
  const [open, setOpen] = React.useState(false);
  const { onChange, status, url, signedBlobId, blobId } = useFileUpload({
    client: useApolloClient()
  });

  function handleModal(){
    setOpen(!open)
  }
  function handleModalConfirm(){
    // grant the user here

    // closing the modal when done
    setOpen(!open)
  }

  function handleSubmit(event){
    event.preventDefault()
    const values = {
      ...data,
      avatarBlobId: signedBlobId
    }
      submitMutation(values)
        .then(({ data }) => {
          // setSubmitting(false);
          history.push(`/user/${data.result.user.id}`);
        })
        .catch(err => console.log(err));
  }
  function handleInputChange(event){
    const { name, value } = event.target
    setData({
      ...data,
      [name]: value
    });
  }

    if (!isLoading && !result.id && !error) {
    loadRecord({ variables: { id: props.match.params.id } });
    
  } else if (isLoading) {
    return <Loading />;
  }

  const values = result.id ? result : data
  
  return (
    <FormContext.Provider value={{values, imageUrl: url, handleInputChange, handleSubmit, handleFileUpload: onChange, status }}>
      <Nav
        navName={title}
        menuButton="edit"
      />
      <ModalDialog handleClose={handleModal} handleConfirm={handleModalConfirm} open={open} action="deny"/>
      <UserForm />
      {result && result.id ? (
        <div className="row justify-content-center align-items-center">
          <Button
            variant="contained"
            className={`btn ${css(styles.grantButton)}`}
          >
            Grant
          </Button>
          <Button
            variant="contained"
            onClick={handleModal}
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

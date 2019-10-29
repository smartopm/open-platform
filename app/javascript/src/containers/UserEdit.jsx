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

export const formContext = React.createContext({ values: initialValues, handleInputChange: () => {} })


export default function Container(props) {
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
  if (props && props.id) {
    title = "Editing User";
  }
  const [data, setData] = React.useState(initialValues)
  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });

  function handleSubmit(){

    const values = {
      ...data,
      signedBlobId
    }
      submitMutation(values)
        .then(({ data }) => {
          // setSubmitting(false);
          history.push(`/user/${data.result.user.id}`);
        })
        .catch(err => console.log(err));
  }
  const handleInputChange = event => {
    const { name, value } = event.target
    setData({
      ...data,
      [name]: value
    });
  };

    if (!isLoading && !result.id && !error) {
    loadRecord({ variables: { id: props.match.params.id } });
    
  } else if (isLoading) {
    return <Loading />;
  }
  
  return (
    <formContext.Provider value={{values: result || data, imageUrl: url, handleInputChange, handleSubmit, handleFileUpload: onChange, status }}>
      <Nav
        navName={title}
        menuButton="edit"
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
    </formContext.Provider>
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

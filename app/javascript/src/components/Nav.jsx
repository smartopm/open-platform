import React, { useContext, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import Avatar from "@material-ui/core/Avatar";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { Context as AuthStateContext } from "../containers/Provider/AuthStateProvider.js";
import logoUrl from "../../../assets/images/nkwashi_white_logo_transparent.png";
import Drawer from "@material-ui/core/Drawer";
import { SideList } from "./SideList.jsx";
import { formContext } from "../containers/UserEdit.jsx";

export default withRouter(function Nav({
  children,
  menuButton,
  history,
  navName,
  backTo,
  handleSubmit,
  boxShadow
}) {
  const authState = useContext(AuthStateContext);
  return (
    <Component
      {...{
        children,
        authState,
        menuButton,
        history,
        navName,
        backTo,
        handleSubmit,
        boxShadow
      }}
    />
  );
});

export function Component({
  children,
  authState,
  menuButton,
  navName,
  backTo,
  history,
  // handleSubmit,
  boxShadow
}) {
  const [state, setState] = React.useState(false);
  const {values, handleSubmit} = useContext(formContext)
  function backButtonOrMenu() {
    const to = backTo || "/";
    if (menuButton === "back") {
      return (
        <a href="#" className={css(styles.buttonLeft)} onClick={history.goBack}>
          <i className={`material-icons ${css(styles.icon)}`}>arrow_back</i>
        </a>
      );
    } else if (menuButton === "cancel") {
      return (
        <Link className={css(styles.buttonLeft)} to={to}>
          <i className={`material-icons ${css(styles.icon)}`}>clear</i>
        </Link>
      );
    } else if (menuButton === "edit") {

      return (
        <Fragment>
          <Link className={css(styles.buttonLeft)} to={to}>
            <i className={`material-icons ${css(styles.icon)}`}>clear</i>
          </Link>
          <span onClick={e => handleSubmit(e, values)}>
            <i className={`material-icons ${css(styles.rightSideIcon)}`}>
              check
            </i>
          </span>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Avatar
          alt="Default Avatar"
          onClick={toggleDrawer}
          className={`${css(styles.userAvatar)}`}
          src={authState.user.avatarUrl}
        />
        <NotificationsNoneOutlinedIcon
          className={`${css(styles.rightSideIcon)}`}
        />
      </Fragment>
    );
  }

  function communityName() {
    if (authState.id && authState.community) {
      if (authState.community.logoUrl) {
        return (
          <Link to="/">
            <img
              src={authState.community.logoUrl}
              className={css(styles.logo)}
            />
          </Link>
        );
      }
      return (
        <Link to="/">
          <div>{authState.community.name}</div>
        </Link>
      );
    }
    return (
      <Link to="/">
        <img src={logoUrl} className={css(styles.logo)} />
      </Link>
    );
  }
  const toggleDrawer = event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(!state);
  };
  return (
    <>
      <Drawer open={state} onClose={toggleDrawer}>
        <SideList toggleDrawer={toggleDrawer} user={authState.user} />
      </Drawer>
      <nav
        className={`navbar navbar-dark ${css(styles.navBar)}`}
        style={{ boxShadow }}
      >
        <div className={css(styles.topNav)}>
          {backButtonOrMenu()}
          <ul
            className={`navbar-nav navbar-center ${css(styles.navTitle)}`}
            style={{ margin: "auto" }}
          >
            <li>{navName ? navName : communityName()}</li>
          </ul>
        </div>

        <div className="nav navbar-nav" style={{ width: "100%" }}>
          {children}
        </div>
      </nav>
    </>
  );
}

Component.defaultProps = {
  boxShadow: "0 2px 2px 0 rgba(0,0,0,.14)"
};

const styles = StyleSheet.create({
  logo: {
    height: "25px"
  },
  topNav: {
    width: "100%",
    position: "relative"
  },
  navTitle: {
    top: "8px",
    color: "#FFF"
  },
  arrow: {
    color: "#fff",
    "font-size": "1.5em"
  },
  navBar: {
    backgroundColor: "#46ce84",
    minHeight: "50px"
    // boxShadow: "0 2px 2px 0 rgba(0,0,0,.14)"
  },
  buttonLeft: {
    color: "#FFF"
  },
  icon: {
    lineHeight: "1.7em"
  },
  userAvatar: {
    width: 30,
    height: 30,
    color: "#FFF"
  },
  rightSideIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    height: 30,
    color: "#FFF",
    ":hover": {
      cursor: "pointer"
    }
  }
});

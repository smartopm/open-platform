// It could be a live map, using a static image as a map for now
import React, { Fragment } from "react";
import Nav from "../components/Nav";
import { StyleSheet, css } from "aphrodite";

export default function Explore() {
  return (
    <Fragment>
      <Nav navName="Explore" menuButton="back" />
      <div className={css(styles.mapContainer)}>
        <img
          src="http://nkwashi.com/wp-content/uploads/2017/02/Map-of-distict.jpg"
          alt="nkwashi static map"
          className="img-fluid"
        />
      </div>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: 100
  }
});

import React from 'react'
import { css, StyleSheet } from "aphrodite";

export default function ShowRoom() {
    return (
        <div
            className={`${css(styles.welcomePage)}`}
        >
            Welcome to Thebe Investment Management
        </div>
    )
}

const styles = StyleSheet.create({
    welcomePage: {
        position: " absolute",
        left: " 50%",
        top: " 50%",
        "-webkit-transform": " translate(-50%, -50%)",
        transform: " translate(-50%, -50%)",
    },

});
import { Avatar } from "@mui/material";
import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import AvatarCard from "../Avatar/AvatarCard";
import UserActivity from "../UserActivity/UserActivity";

const useStyles = makeStyles({
    root : {
        display : "flex",
    }
});

function User() {
    const { userId} = useParams();
    const classes = useStyles();
    const [user, setUser] = useState();
    
    const getUser = () => {
        fetch("/users/"+userId)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                setUser(result);
            },
            (error) => {
                console.log(error)
            }
        )
        }

        useEffect(() => {
            getUser()
        }, [])


    return (
        <div className={classes.root}>
            <AvatarCard userId = {userId} avatarId={0}></AvatarCard>
            {localStorage.getItem("currentUser")==userId ?
            <UserActivity userId={userId}></UserActivity> : " "}
        </div>
    )
}

export default User;
import React from "react";
import { makeStyles } from '@mui/styles';
import { CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { Link } from "react-router-dom";

const useStyles = makeStyles({
    comment: {
        display: "flex",
        flexWarp: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    link: {
        textDecoration: "none",
        boxShadow: "none",
        color: "white"
    },
});

function Comment(props) {
    const { text, userId, userName } = props;
    const classes = useStyles();

    return (
        <CardContent className={classes.comment}>
            <OutlinedInput
                disabled
                id="outlined-adornment-amount"
                multiline
                inputProps={{ maxlength: 250 }}
                fullWidth
                value={text}
                startAdornment={
                    <InputAdornment position="start">
                        <Link  className={classes.link} style={{ textDecoration: "none", color: "white", boxShadow: "none" }} to={{ pathname: '/users/' + userId }}>User
                            <Avatar sx={{ bgcolor: "gray" }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    </InputAdornment>
                }>
            </OutlinedInput>
        </CardContent>
    )

}
export default Comment;
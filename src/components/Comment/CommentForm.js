import React, { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles';
import { CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import { RefreshToken } from "../../services/HttpService";

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

function CommentForm(props) {
    const { postId, userId, userName,setCommentRefresh } = props;
    const [text, setText] = useState("");
    const classes = useStyles();

    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("userName")
        localStorage.removeItem("refreshKey")
        navigate(0)
    }


    const saveComment = () => {
        fetch("/comments",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey"),
                },
                body: JSON.stringify({
                    postId: postId,
                    userId: userId,
                    text: text,
                }),
            })
            .then(res => {
                if(!res.ok){
                    RefreshToken().then((res) => {
                        if(!res.ok){
                            logout();
                        }
                        else{
                            return res.json()
                        }})
                        .then((result) => {
                            if(result!= undefined){
                                localStorage.setItem("tokenKey",result.accessToken);
                                localStorage.setItem("refreshKey",result.refreshToken);
                                localStorage.setItem("currentUser",result.userId);
                                saveComment();
                                setCommentRefresh();
                            };
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else{
                    res.json()
                }})
            .catch(err => {
                console.log(err)
            })
    }

    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
    }

    const handleChange = (value) => {
        setText(value);
    }

    return (
        <CardContent className={classes.comment}>
            <OutlinedInput
                id="outlined-adornment-amount"
                multiline
                inputProps={{ maxlength: 250 }}
                fullWidth
                onChange={(i)=>handleChange(i.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <Link  className={classes.link} style={{ textDecoration: "none", color: "white", boxShadow: "none" }} to={{ pathname: '/users/' + userId }}>User
                            <Avatar sx={{ bgcolor: "gray" }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <Button variant="contained" style={{background:"green"}} onClick={handleSubmit}>
                            SEND COMMENT
                        </Button>
                    </InputAdornment>
                }
                value={text}>
            </OutlinedInput>
        </CardContent>
    )

}
export default CommentForm;


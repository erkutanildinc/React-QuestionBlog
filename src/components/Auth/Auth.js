import { FormControl, InputLabel, Input, Button, FormHelperText } from "@mui/material";
import { color } from "@mui/system";
import React, { useState } from "react";


function Auth() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
   

    const handleUsername = (value) => {
        setUsername(value)
    }

    const handlePassword = (value) => {
        setPassword(value)
    }

    const sendRequest = (path) => {
        fetch("/auth/"+path,{
        method:"POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            username : username, 
            password : password,
        }),
    })
          .then((res) => res.json())
          .then((result) => {localStorage.setItem("tokenKey",result.accessToken);
                            localStorage.setItem("refreshKey",result.refreshToken);          
                            localStorage.setItem("currentUser",result.userId);
                            localStorage.setItem("userName",username)})
          .catch((err) => console.log(err))
    }

    const handleButton = (path) => {
        sendRequest(path)
        setUsername("")
        setPassword("")
    }
   

    return (
        <FormControl>
            <InputLabel>Username</InputLabel>
            <Input onChange={(i) => handleUsername(i.target.value)} />
            <InputLabel style={{ top: 80 }}>Password</InputLabel>
            <Input onChange={(i) => handlePassword(i.target.value)}
                style={{ top: 40 }} />
            <Button varient="contained"
                style={{
                    marginTop: 60,
                    background: "gray",
                    color: "white"
                }}
                onClick= {() => handleButton("register")}
                >
                Register</Button>
            <FormHelperText style={{ marginTop: 30 }}>Are You Already Registered?</FormHelperText>
            <Button varient="contained"
                style={{
                    marginTop: 10,
                    background: "green",
                    color: "white"
                }}
                onClick= {() => handleButton("login")}
                >
                Login</Button>
        </FormControl>
    )
}
export default Auth;
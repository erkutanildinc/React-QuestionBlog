import React from "react";
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { LockOpen } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom'

function Navbar() {

    const navigate = useNavigate()
    const onClick = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("userName")
        localStorage.removeItem("refreshKey")
        navigate(0)
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                <AppBar position="static" sx={{ bgcolor: "darkBlue" }} >
                    <Toolbar >
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link style={{ textDecoration: "none", color: "white", boxShadow: "none" }} to="/">Home</Link>
                        </Typography>
                        <Typography variant="h6" component="div">
                            {localStorage.getItem("currentUser") == null ? <Link style={{ textDecoration: "none", color: "white", boxShadow: "none" }} to="/auth">Login/Register</Link> :
                                <div><IconButton style={{color :"white"}} onClick={onClick}><LockOpen></LockOpen>LogOut</IconButton>
                                    <Link style={{ textDecoration: "none", color: "white", boxShadow: "none" }} to={{ pathname: "/users/" + localStorage.getItem("currentUser") }}>Profile</Link>
                                </div>
                            }
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    )
}

export default Navbar;
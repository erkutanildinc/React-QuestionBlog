import React, { useState, useEffect,forwardRef } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Post from "../Post/Post";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
        minWidth: 100,
        maxWidth: 800,
        marginTop: 50,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: 2,
        flex: 1,
    },
});

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
    {
        id: 'User Activity',
        label: 'User Activity',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
];

function PopUp(props) {

    const classes = useStyles();
    const { isOpen, postId, setIsOpen } = props;
    const [open, setOpen] = useState(isOpen);
    const [post, setPost] = useState();

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    const getPost = () => {
        fetch("/posts/" + postId,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey"),
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setPost(result);
                },
                (error) => {
                    console.log(error)
                }
            )
    }


    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        getPost();
    }, [postId])

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Close
                    </Typography>
                </Toolbar>
            </AppBar>
            {post ? <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName}
                title={post.title} text={post.text}></Post> : "loading"}
        </Dialog>
    )
}

function UserActivity(props) {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const { userId } = props;
    const [selectedPost, setSelectedPost] = useState();
    const [isOpen, setIsOpen] = useState();

    const handleNotification = (postId) => {
        setSelectedPost(postId);
        setIsOpen(true);
    };

    const getActivity = () => {
        fetch("/users/activity/" + userId,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey"),
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    console.log(result);
                    setRows(result)
                },
                (error) => {
                    console.log(error)
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        getActivity()
    }, [])


    return (
        <div>
        {isOpen? <PopUp isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen}/>: ""}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            User Activity
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <Button onClick={() => handleNotification(row[1])}>
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {row[3] + "" + row[0] + " your post"}
                                    </TableRow>
                                </Button>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        </div>
    )
}
export default UserActivity;
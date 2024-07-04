import React from "react";
import Post from "../Post/Post";
import PostForm from "../Post/PostForm";
import { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    container: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f0f5ff',
    }
});


function Home() {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [postList, setPostList] = useState([])
    const classes = useStyles();

    const refreshPosts = () => {
        fetch("/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        refreshPosts();
    }, [])


    if (error) {
        return <div> Error !!! </div>;
    }
    else if (!isLoaded) {
        return <div> Loading !!! </div>;
    }
    else {
        return (
            <div className={classes.container}>
                {localStorage.getItem("currentUser") == null ? "" : <PostForm userName={localStorage.getItem("userName")} userId={localStorage.getItem("currentUser")} refreshPosts={refreshPosts}></PostForm>}
                {postList.map(post => (
                    <Post likes={post.postLikes} postId={post.id} userName={post.userName} userId={post.userId} title={post.title} text={post.text} ></Post>
                ))}
            </div>
        );
    }
}
export default Home;
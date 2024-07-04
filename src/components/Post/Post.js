import React, { useState, useEffect, useRef } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from "react-router-dom";
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


function Post(props) {
    const { postId, title, text, userId, userName, likes } = props;
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [commentList, setCommentList] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(likes.length)
    const isInitialMount = useRef(true);
    const [likeId, setLikeId] = useState(null);
    const [refresh,setRefresh] = useState(false);
    let disabledComponent = localStorage.getItem("currentUser") == null ? true : false;


    const setCommentRefresh = () => {
        setRefresh(true);
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (isLiked) {
            setLikeCount(likeCount - 1)
            deleteLike();
        }
        else {
            setLikeCount(likeCount + 1)
            saveLike();
        }

    }

    const refreshComments = () => {
        fetch("/comments?postId=" + postId)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setCommentList(result)
                },
                (error) => {
                    console.log(error)
                    setIsLoaded(true);
                    setError(error);
                }
            )
            setRefresh(false);
    }

    const saveLike = () => {
        fetch("/likes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey"),
                },
                body: JSON.stringify({
                    postId: postId,
                    userId: localStorage.getItem("currentUser"),
                }),
            })
            .then(res => res.json())
            .catch(err => console.log("error"))
    }

    const deleteLike = () => {
        fetch("/likes/" + likeId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": localStorage.getItem("tokenKey"),
                },
            })
            .then(res => res.json())
            .catch(err => console.log("error"))
    }

    const checkLikes = () => {
        var likeControl = likes.find(like => ""+like.userId === localStorage.getItem("currentUser"));
        if (likeControl != null) {
            setIsLiked(true);
            setLikeId(likeControl.id);
        }
    }

    useEffect(() => {
        if (isInitialMount.current)
            isInitialMount.current = false;

        else
            refreshComments();
    }, [refresh])

    useEffect(() => { checkLikes() }, [])

    return (
        <div className="postContainer">
            <Card sx={{ maxWidth: 800, minWidth: 800, margin: 5 }}>
                <CardHeader
                    avatar={
                        <Link style={{ textDecoration: "none", color: "white", boxShadow: "none" }} to={{ pathname: '/users/' + userId }}>User
                            <Avatar sx={{ bgcolor: "gray" }} aria-label="recipe">
                                {userName ? userName.charAt(0).toUpperCase() : "U"}
                            </Avatar>
                        </Link>
                    }
                    title={title}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                {disabledComponent ?                    
                  <IconButton 
                    disabled
                    onClick={handleLike}
                    aria-label="add to favorites"
                    >
                    <FavoriteIcon style={isLiked? { color: "red" } : null} />
                    </IconButton> :
                    <IconButton 
                    onClick={handleLike}
                    aria-label="add to favorites"
                    >
                    <FavoriteIcon style={isLiked? { color: "red" } : null} />
                    </IconButton>
                  }
                    {likeCount}
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <CommentIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <div fixed>
                        {error ? "error" :
                            isLoaded ? commentList.map(comment => (<Comment userId={userId} userName={"USER"} text={comment.text}></Comment>
                            )) : "Loading"}
                            {disabledComponent ? "" : <CommentForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} postId={postId} setCommentRefresh={setCommentRefresh}></CommentForm>}
                    </div>
                </Collapse>
            </Card>
        </div>
    )
}
export default Post;
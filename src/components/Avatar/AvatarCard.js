import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { ListItem, List, ListItemSecondaryAction, Radio } from '@mui/material';
import { height } from "@mui/system";

function AvatarCard(props) {

    const { avatarId,userId,username} = props;

    const style = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        saveAvatar();
    }
    const [selectedValue, setSelectedValue] = useState(avatarId);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const saveAvatar = () => {
        fetch("/users/" + localStorage.getItem("currentUser"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey"),
            },
            body: JSON.stringify({
                avatar: selectedValue,
            }),
        })
            .then((res) => res.json())
            .catch((err) => console.log(err))
    }


    return (
        <div>
            <Card sx={{ maxWidth: 305 }}>
                <CardMedia
                    sx={{ height: 300, width: 300 }}
                    component="img"
                    image={`/avatars/avatar${selectedValue}.png`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        User Info
                    </Typography>
                </CardContent>
                <CardActions>
                    {localStorage.getItem("currentUser")==userId ? <Button size="small" color="primary" onClick={handleOpen}>
                        Change Avatar
                    </Button> : " "}
                </CardActions>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <List dense>
                    {[0, 1, 2].map((key) => {
                        const labelId = `checkbox-list-secondary-label-${key}`;
                        return (
                            <ListItem key={key} button>
                                <CardMedia
                                    style={{ maxWidth: 100 }}
                                    component="img"
                                    alt={`Avatar n°${key}`}
                                    image={`/avatars/avatar${key}.png`}
                                    title="User Avatar"
                                />
                                <ListItemSecondaryAction>
                                    <Radio
                                        edge="end"
                                        value={key}
                                        onChange={handleChange}
                                        checked={"" + selectedValue === "" + key}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </Modal>
        </div>
    )
}

export default AvatarCard;
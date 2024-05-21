import React, {Fragment, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {isAuthenticated, userInfo} from "../../utils/auth";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Products from "../../api/product";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface User {
    token : string
}
const DeleteProducts = (props: {productIDs:any}) => {
    const [authenticated, setAuthenticated] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    console.log("props.productIDs",props.productIDs)

    useEffect(()=> {
        setAuthenticated(isAuthenticated())
    },[])

    useEffect(()=>{
        console.log("!authenticated && props.productIDs.length", authenticated , props.productIDs.length ===0, !authenticated && props.productIDs.length===0)
        authenticated && props.productIDs.length>0 ? setDisabled(false) : setDisabled(true)
    },[authenticated, props.productIDs])


    const modalAction = () => {
        handleOpen()
    }

    const handleDelete = async () => {
        const user = userInfo<User>(null)
        await Products.batchDelete(props.productIDs, user.token).then(r=>handleClose()).catch(r=>console.log(r))
    }

  return (
      <Fragment>
          <Button variant={"outlined"} disabled={disabled} onClick={()=>modalAction()}>
              Delete Products
          </Button>
          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
              <Box sx={style}>
                  <Typography id="modal-modal-title" component="h2">
                      Are you sure you want to <span style={{color : "red"}}>delete</span> ({props.productIDs.length}) items?
                  </Typography>
                  <Box sx={{display : 'flex', justifyContent : "space-between" , mt: 4}}>
                      <Button variant={"outlined"} onClick={()=>handleClose()}>
                          No
                      </Button>
                      <Button variant={"outlined"} color="error" onClick={()=>handleDelete()}>
                          Yes Proceed ({props.productIDs.length})
                      </Button>
                  </Box>
              </Box>
          </Modal>
      </Fragment>
  )
}
export default DeleteProducts
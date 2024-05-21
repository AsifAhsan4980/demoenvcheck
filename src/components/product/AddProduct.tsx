import * as React from 'react';
import Button from "@mui/material/Button";
import {Fragment, useEffect, useState} from "react";
import Dialog, {DialogProps} from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {Alert, Grid, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm} from "react-hook-form";
import {isAuthenticated, userInfo} from "../../utils/auth";
import Product from "../../api/product";
import Products from "../../api/product";

interface FormValues {
    product_name: string;
    unit_price: number;
    status: string;
    category_name: string;
    available_since: string;
    category_id: number;
    _id: string
}

interface User {
    token : string
}

interface Message {
    type : any,
    description : string
}

const AddProduct = () => {
    const [open, setOpen] = React.useState(false);
    const [authenticated, setAuthenticated] = useState(false)
    const [message, setMassage] = useState(false)
    const [messageDeatails, setDetails] = useState<Message>({
        type : '',
        description : ''
    })

    useEffect(() => {
        setAuthenticated(isAuthenticated())
    }, [])

    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormValues>()
    const handleClose = () => {
        setOpen(false);
    };
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log(data)
        let req = {
            available_since: data.available_since,
            category_id: parseInt(String(data.category_id)),
            category_name: data.category_name,
            product_name: data.product_name,
            status: data.status === "true",
            unit_price: parseInt(String(data.unit_price)),
        }

        const user = userInfo<User>(null)


        console.log(user.token)
        await Products.createProduct(req, user.token)
            .then(r => {
                reset()
                setMassage(true)
                setDetails({
                    type : 'success',
                    description : 'Product has been updated'
                })

            })
            .catch(r => {
                setMassage(false)
                setDetails({
                    type : 'error',
                    description : 'Something went wrong. Try again later'
                })
            })
    }

    return (
        <Fragment>
            <Button variant={"outlined"} disabled={!authenticated} onClick={() => setOpen(true)}>
                Add Product
            </Button>

            <Dialog
                fullWidth
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    {message && (<Alert sx={{mb:2}} severity={messageDeatails.type}>{messageDeatails.description}</Alert>) }
                    <Paper sx={{p: 2}} elevation={3}>


                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <TextField
                                        id="outlined-basic"
                                        type="product_name"
                                        label="Product Name"
                                        variant="outlined"
                                        fullWidth
                                        {...register('product_name', {
                                            required: {
                                                value: true, message: `Product Name is required`
                                            }
                                        })}
                                        placeholder="Product Name"
                                        error={Boolean(errors.product_name)}
                                        helperText={errors.product_name?.message}
                                    />
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        id="outlined-basic"
                                        type="number"
                                        label="Unit Price"
                                        variant="outlined"
                                        fullWidth
                                        {...register('unit_price', {
                                            required: {
                                                value: true, message: `Unit Price is required`
                                            }
                                        })}
                                        placeholder="Unit Price"
                                        error={Boolean(errors.unit_price)}
                                        helperText={errors.unit_price?.message}/>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        id="outlined-basic"
                                        type="available_since"
                                        label="Available Since"
                                        variant="outlined"
                                        fullWidth
                                        {...register('available_since',)}
                                        placeholder="Available Since"/>
                                </Grid>
                                <Grid item sm={12}>
                                    <TextField id="outlined-basic"
                                               type="category_name"
                                               label="Category Name"
                                               variant="outlined"
                                               fullWidth
                                               {...register('category_name',)}
                                               placeholder="Email"
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <TextField id="outlined-basic"
                                               type="number"
                                               label="Category ID"
                                               variant="outlined"
                                               fullWidth
                                               {...register('category_id',)}
                                               placeholder="Category ID"
                                    />
                                </Grid>

                                <Grid item sm={12}>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">Staus</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue={true}
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel
                                                value={true}
                                                {...register('status')}
                                                control={<Radio/>}
                                                label="Avalavle"/>
                                            <FormControlLabel
                                                value={false}
                                                {...register('status')}
                                                control={<Radio/>}
                                                label="Not Availabe"/>
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={12}>
                                    <Button type={"submit"} variant={"outlined"}>
                                        Add Product
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>

                </DialogContent>
                <DialogActions>
                    <Button variant={"outlined"} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
export default AddProduct
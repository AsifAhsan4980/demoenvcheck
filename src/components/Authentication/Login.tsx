import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import {Grid} from "@mui/material";
import Button from "@mui/material/Button";

import {useForm, SubmitHandler} from "react-hook-form"
import Auth from "../../api/auth";
import {authenticate} from "../../utils/auth";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";


type FormValues = {
    email: string
    password: string
}


const Login = (props : {changeModal: any}) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false)

    const {register, handleSubmit, setError,formState: {errors}} = useForm<FormValues>()

    const myGreeting = () => {
        setShow(false)
        props.changeModal(false)
        navigate("/");
        window.location.reload();
    }
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        Auth.login({ email : data.email, password : data.password })
            .then(response => {
                console.log(response)
                authenticate(response.data.token, () => {
                    setShow(true)
                    setTimeout(myGreeting, 3000);
                })
            })
            .catch((error) => {
                // Error
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response);
                    if (error.response.data.message === "User not found"){
                        setError('email', {
                            type: 'custom',
                            message: 'User does nor exist'
                        }, {shouldFocus: true})
                    }
                    if (error.response.data.message === "Invalid credentials"){
                        setError('email', {
                            type: 'custom',
                            message: 'Email or Password do not match'
                        }, {shouldFocus: true})
                        setError('password', {
                            type: 'custom',
                            message: 'Email or Password do not match'
                        }, {shouldFocus: true})
                    }
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the
                    // browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                // console.log(error.config);
            });

    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                {show &&
                    <Grid item sm={12}>
                        <Alert severity="success">Log in Successful. Redirecting...</Alert>
                    </Grid>
                }
                <Grid item sm={12}>
                    <TextField
                        id="outlined-basic"
                        type="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        {...register('email', {
                            required: {
                                value: true, message: `Email is required`
                            }, pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: "Email address is not valid"
                            }
                        })}
                        placeholder="Email"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        id="outlined-basic"
                        type="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        {...register('password', {
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*? ])[A-Za-z\d#$@!%&*?]{8,30}$/,
                                message: "at least one uppercase letter, one lowercase letter, one number and one special character"
                            },
                            required: {value: true, message: "Password is required"},
                            minLength: {value: 8, message: "Minimum length of password is 8"},
                        })}
                        placeholder="Passowrd"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                    />
                </Grid>
                <Grid item sm={12}>
                    <Button variant={"outlined"} type="submit">
                        Log me in
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default Login
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './login.scss';
import { publicRequest } from "../../requestMethods";
import { useState } from 'react';
import { useToastError, useToastSuccess } from "../../utils/toastSettings";



function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                SapoDelivery
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        console.log(user);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await publicRequest.post(`/authenticate`, user);
        if (res.status !== 200) {
            useToastError("Something went wrong!");
        } else {
            useToastSuccess("Login success");
            console.log('token:', res.data.access_token);
        }

    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <div className='main-container'>
                <div className='sapo-logo'></div>
                <Grid container component="main" sx={{ height: '50vh', width: '70vw', margin: 'auto' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(https://sapo.dktcdn.net/sso-service/images/background-bottom-pos-app.svg)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />



                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >

                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => onInputChange(e)}
                                    value={user.email}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(e) => onInputChange(e)}
                                    value={user.password}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                                {/* <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="#" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid> */}
                                <Copyright sx={{ mt: 5 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>

        </ThemeProvider>
    );
}
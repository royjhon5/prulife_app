import React from 'react';
import http from "../../api/http.jsx";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
    Card,
      Container,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@mui/material";
import { tokens, useMode } from "../../theme.js";
import { toast, Toaster } from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from '../../modules/authentication/AuthContext.jsx';

export default function Login() {
    const [theme, colorMode] = useMode();
    const { setUser, csrfToken } = useAuth();
    const [error, setError] = React.useState(null);

    // login user
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = e.target.elements;
        const body = {
            username: username.value,
            password: password.value,
        };
        if (username.value === '' || password.value === '') {
            toast.error("Enter your credentials to login!");
            return;
        } else {
            // await csrfToken();
            const resp = await toast.promise(
                http.post('/login', body),
                {
                    loading: 'Logging In...',
                    success: 'Successfully Logged In!',
                    error: 'Login failed. Username or Password is Incorrect!',
                }
            );
            if (resp.status === 200) {
                setUser(resp.data.user[0]);
            } else if (error.response.status === 401) {
                setError(error.response.data.message);
            }
        }
    };

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
        <Toaster position="top-center"
                toastOptions={{
                    style: {
                        width: 399,
                        fontSize: 15,
                        paddingLeft: 10,
                    },
                }}
                containerStyle={{
                    top: 20,
                    left: 20,
                    bottom: 20,
                    right: 20,
                }}
            />
            <Container component="main" maxWidth="sm" >
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 2 }} direction={{ xs: 'column', sm: 'row' }}>
                    <CssBaseline>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItem: "center", marginTop: "20vh" }}>
                            <Card sx={{ borderRadius: 3, background: `whiter` }}>
                                <Box component="form" noValidate onSubmit={handleSubmit}>
                                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 2 }} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3, }}>
                                        <Grid item xs={12}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="username"
                                                label="Username"
                                                name="username"
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl sx={{ mt: 0.5, }} fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                    name="password"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                size="large"
                                                variant="contained"
                                                color="success"
                                                sx={{ mt: 1, mb: 1 }}
                                            >
                                                Sign In
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    </CssBaseline>
                </Grid>
            </Container>
        </>
    );
}
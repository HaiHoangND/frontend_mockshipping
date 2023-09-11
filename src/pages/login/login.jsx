import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./login.scss";
import { publicRequest } from "../../requestMethods";
import { useState } from "react";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await publicRequest.post(`/authenticate`, user);
    if (res.status !== 200) {
      return useToastError("Thông tin tài khoản chưa đúng!");
    } else {
      useToastSuccess("Đăng nhập thành công");
      signIn({
        token: res.data.access_token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {
          id: res.data.id,
          profilePicture: res.data.profilePicture,
          role: res.data.role,
          warehouseId: res.data.warehouseId,
          username: res.data.userName,
        },
      });
      if (res.data.role === "COORDINATOR") return navigate("/coordinator");
      else if (res.data.role === "SHIPPER") return navigate("/shipper")
      else if (res.data.role === "ADMIN") return navigate("/admin")
      else if (res.data.role === "SHOP") return navigate("/shop")
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="main-container">

        <Grid
          container
          component="main"
          sx={{ height: '100vh' }}
        >
          <CssBaseline />
          <Grid
            className="left-logo"
            item
            xs={2}
            sm={3}
            md={7}
          ><div className="sapo-logo"></div></Grid>

          <Grid
            className="right-side"
            item
            xs={8}
            sm={6}
            md={4}
            sx={{ my: 20, height: '60vh' }}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              className="form-box"
              sx={{
                my: 8,
                mx: 4,
                height: '25vh',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                className="form-title"
                component="h1" variant="h5">
                Đăng nhập
              </Typography>
              <Box
                className="form-input-text"
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  size="small"
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
                  size="small"
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

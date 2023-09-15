import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { publicRequest } from "../../requestMethods";
import { useToastError } from "../../utils/toastSettings";
import { Link } from "react-router-dom";
import "./login.scss";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    ></Typography>
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await publicRequest.post(`/authenticate`, user);
    if (res.status !== 200) {
      return useToastError("Thông tin tài khoản chưa đúng!");
    } else {
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
      else if (res.data.role === "SHIPPER") return navigate("/shipper");
      else if (res.data.role === "ADMIN") return navigate("/admin");
      else if (res.data.role === "SHOP") return navigate("/shop");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="main-container">
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid className="left-logo" item xs={2} sm={3} md={7}>
            <div className="sapo-logo"></div>
          </Grid>

          <Grid
            className="right-side"
            item
            xs={8}
            sm={6}
            md={4}
            sx={{ my: 20, height: "60vh" }}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              className="form-box"
              sx={{
                my: 8,
                mx: 4,
                height: "25vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography className="form-title" component="h1" variant="h5">
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
                  label="Mật khẩu"
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
                  Đăng nhập
                </Button>
                <div className="flex items-center justify-center">
                  <Link to="/register" className=" text-center italic underline" style={{fontSize:"15px"}}>
                    Chưa có tài khoản? Đăng kí
                  </Link>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

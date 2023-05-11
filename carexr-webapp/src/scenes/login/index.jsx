import { Box, useTheme, Button, TextField, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../theme";

import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [error, setError] = useState("");
  const signIn = useSignIn();

  const handleFormSubmit = (values) => {
    console.log(values);

    try {
        const options = {
            method: 'POST',
            url: 'http://54.229.220.82/api/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                query: `query ($email: String!, $password: String!) { MemberLogin (loginCredentials: { email: $email, password: $password } ) { ... on Member { uuid, name, username, email, token MemberOf { role institution { uuid name } } } } }`,
                variables: {
                   email: "caregiver@carexr.com",
                   password: "password"
                }
            },
            withCredentials: false,
            
        };
        
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data); // Response
            })
            .catch(function (error) {
                console.error(error);
            });
        
      /*
      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: values.email },
      });
      */
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);

      console.log("Error: ", err);
    }
  };
  

  return (
    <Box display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
    flexWrap={"wrap"}
    height={"88%"}
   >
        
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
        >
            {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            }) => (
            <form onSubmit={handleSubmit}>
                <Box >
                    <Typography variant="h1" color={colors.grey[100]} fontWeight="bold" sx={{ m: "0 0 8px 0" }} textAlign={"center"}>
                        CareXR
                    </Typography>
                    <Typography variant="h2" color={colors.greenAccent[400]} sx={{ m: "0 0 42px 0" }} textAlign={"center"}>
                        Web Platform
                    </Typography>
                </Box>
                <Box>

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        error={!!touched.firstName && !!errors.firstName}
                        helperText={touched.firstName && errors.firstName}
                        
                        sx={{marginBottom: "24px"}}
                    />
                    
                    <TextField
                        fullWidth
                        variant="filled"
                        type="password"
                        label="Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        error={!!touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                
                    />
                
                
                </Box>
                <Box display="flex" justifyContent="center" mt="32px">
                    <Button type="submit" color="secondary" variant="contained">
                        Login
                    </Button>
                </Box>
            
            </form>
        )}
        </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  email: "",
  password: "",
};

export default Login;
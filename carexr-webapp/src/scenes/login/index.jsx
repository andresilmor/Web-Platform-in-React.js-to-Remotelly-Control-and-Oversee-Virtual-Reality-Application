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

import { useLogin } from "../../hooks/graphql/query/useLogin";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const {error, loading, data} = useLogin("caregiver@carexr.com", "password")
console.log(data)
  const handleFormSubmit = (values) => {
    console.log(values);

    try {

        /*
        fetch('http://54.229.220.82/api', {
            method: 'POST',
            body: `
            query {
                MemberLogin (loginCredentials: { email: "${values["email"]}", password: "${values["password"]}" } ) { 
                    ... on Member { 
                        uuid, 
                        name, 
                        username, 
                        email, 
                        token 
                        MemberOf { 
                            role 
                            institution { 
                                uuid 
                                name 
                            } 
                        } 
                    } 
                }
            }
        `,
            header: {
                'Content-Type': 'application/json',

            }

        }
        
        );
        */

    } catch {

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
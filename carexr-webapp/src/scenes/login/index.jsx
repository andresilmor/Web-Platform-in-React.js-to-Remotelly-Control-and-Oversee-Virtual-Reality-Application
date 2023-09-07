import { Box, useTheme, Button, TextField, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";

import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MemberLogin } from "../../hooks/graphql/query/MemberLogin";
import { saveUser } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");

    var [doLogin, {loading, error, data, called}] = MemberLogin(email, password);
    const signIn = useSignIn();

    const handleFormSubmit = (values) => {
        console.log(values);

        try {
            setLoginStatus("Validating...");
            doLogin();
            
            console.log("2:", loading, error, data, called);
            /*
            fetch('http://34.244.82.96/api', {
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
            setLoginStatus("Connection Error");

        }
    };

    useEffect(() => {
        if (called && !loading) {
            if (data["MemberLogin"].hasOwnProperty("message"))
                setLoginStatus("Invalid");
            else {
                signIn({
                    token: data["MemberLogin"]["token"],
                    expiresIn: 1440,
                    tokenType: "Bearer",
                    authState: {
                        email: data["MemberLogin"]["email"]
                    }
                });

                var memberOf = [];

                data["MemberLogin"]["memberOf"].forEach((value) => {
                    memberOf.push({
                        name: value["institution"]["name"],
                        uuid: value["institution"]["uuid"],
                        role: value["role"],
                    })
                });

                memberOf[0]["selected"] = true

                console.log(memberOf)

                dispatch(saveUser({
                    name: data["MemberLogin"]["name"],
                    memberOf: memberOf,
                    selectedOrganization: memberOf[0]
                }));

                navigate("/");
            }
            console.log(data["MemberLogin"]);

        }
    },[loading]) 

    useEffect(()=>{
        setLoginStatus("Login");
        console.log("1:", loading, error, data, called);
    }, [])

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
                            onChange={(e) => {
                                handleChange(e)
                                setEmail(e.target.value)
                            }}
                            value={values.email}
                            name="email"
                            error={!!touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            
                            sx={{marginBottom: "24px"}}
                        />
                        
                        <TextField
                            fullWidth
                            variant="filled"
                            type="password"
                            label="Password"
                            onBlur={handleBlur}
                            onChange={(e) => {
                                handleChange(e)
                                setPassword(e.target.value)
                            }}
                            value={values.password}
                            name="password"
                            error={!!touched.password && !!errors.password}
                            helperText={touched.password && errors.password}
                    
                        />
                    
                    
                    </Box>
                    <Box display="flex" justifyContent="center" mt="32px">
                        <Button type="submit" color="secondary" variant="contained">
                            {loginStatus}
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
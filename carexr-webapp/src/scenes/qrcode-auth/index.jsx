import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';



import { useAuthUser } from "react-auth-kit";
  
const QRCodeAuth = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [requestStatus, setRequestStatus] = useState("Generate QRCode");
  const [requestingConfirmation, setRequestingConfirmation] = useState(false)
  
  const qrCodeLifetime = 200;
  const [countdown, setCountdown] = useState(qrCodeLifetime);

  const [qr, setQr] = useState("");

  const [wsRoute, setWsRoute] = useState(null);
  const [wsChannel, setWsChannel] = useState("");
  
  const auth = useAuthUser();


  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(wsRoute, {
    onOpen: () => {},
    onMessage: (event) => {
      let data = JSON.parse(event.data)
      if (data["confirmation"] != null && data["confirmation"] == false) {
        setRequestingConfirmation(true);
        return;

      }

    },
    onClose: () => {
      console.log('closed')
      setStartCountdown(false);
      setCountdown(qrCodeLifetime);
      setWsRoute(null)
      setRequestingConfirmation(false);
      setRequestStatus("Generate QRCode");
    
    },
    share: true,
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => false,
    reconnectAttempts: 10,
    reconnectInterval: 30,
  });


  const GenerateQRCode = (qrContent) => {
    QRCode.toDataURL(
      qrContent,
      {
        width: 750,
        margin: 1,
        color: {
          // dark: '#335383FF',
          // light: '#EEEEEEFF'
        },
      },
      (err, content) => {
        if (err) return console.error(err);;
        setQr(content);
      }
    );
  };



  const decreaseCountdown = () => {
 
      
    setCountdown((prev) => prev - 1)
  };

  const [startCountdown, setStartCountdown] = useState(false);

  let intervalRef = useRef();

  useEffect(() => {
    if (!startCountdown)
      return;

    intervalRef.current = setInterval(decreaseCountdown, 1000);


    return () => clearInterval(intervalRef.current);
  }, [startCountdown]);

  useEffect(() =>  {
    if (countdown > 0)
      return
      
    setStartCountdown(false);
    setCountdown(qrCodeLifetime);
    setWsRoute(null)
    setWsChannel(null)
    setRequestingConfirmation(false)
    setRequestStatus("Generate QRCode");

  }, [countdown])

  const codeFetch = async () => {
    const data = await (
      await fetch(`http://34.244.43.25/authChannel`)
      .then(res => res.json())
      .then(
        (result) => {
          setRequestStatus("Requested")

          GenerateQRCode(result["token"]);          
          setStartCountdown(true)
          setWsRoute("ws://34.244.43.25/ws/qr/auth")
          console.log(result["channel"])
          setWsChannel(result["channel"])
          sendMessage(JSON.stringify({
            channel: result["channel"],
          }))      

          return result
        },
        (error) => {
        
        }
      )

    );

  };

  const requestQRCode = () => {
    if (startCountdown)
      return

    setRequestStatus("Requesting...")
    codeFetch();

  }

  
  const confirmQRCode = async () => { 
    console.log(auth())
    
    sendMessage(
      JSON.stringify({
        channel : wsChannel,
        confirmation : true,
        uuid: Cookies.get('_auth')
      })
    )
  }

  const denyQRCode = async () => { 
    sendMessage(
      JSON.stringify({
        channel: wsChannel,
        confirmation: false,
      })
    )
  }

  return (
    <Box sx={{ marginInline: "24px" }}>
      <Header
        title="QRCode Auth"
        subtitle="Authenticate through CareXR applications by using QRCode"
      />

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignContent={"center"}
          >
            {!requestingConfirmation ? (
              <>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={requestQRCode}
                >
                  {requestStatus}
                  {startCountdown ? " (" + countdown + ")" : ""}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={confirmQRCode}
                >
                  Confirm
                </Button>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={denyQRCode}
                >
                  Deny
                </Button>
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={10}>
          {startCountdown && (
            <>
              <img
                src={qr}
                style={{
                  marginLeft: "180px",
                  marginTop: "12px",
                  marginBottom: "12px",
                }}
              />
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRCodeAuth;
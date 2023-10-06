import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";
import { persistStore } from 'redux-persist';
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

const client = new ApolloClient({
  uri: "https://866f-62-28-213-98.ngrok-free.app/api",
  cache: new InMemoryCache()
})

let persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>   
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AuthProvider
            authType={"cookie"}
            authName={"_auth"}
            cookieDomain={window.location.hostname}
            cookieSecure={false}
          >
            <BrowserRouter>    
                <App />
            </BrowserRouter>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>

  </React.StrictMode>
);


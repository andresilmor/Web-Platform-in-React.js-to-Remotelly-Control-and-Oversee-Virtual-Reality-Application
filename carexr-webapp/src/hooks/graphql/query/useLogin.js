import { useLazyQuery, gql } from "@apollo/client";


const LOGIN_QUERY = gql`
    query ($email: String!, $password: String!) { 
      MemberLogin (loginCredentials: { email: $email, password: $password } ) { 
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
        ... on Error {
          message
        }
      } 
    }
  `

export const useLogin = (email, password) => {
    const [method, {loading, error, data, called}] = useLazyQuery(
        LOGIN_QUERY, {
          variables: {
            email, password
          },
          fetchPolicy: 'network-only',
        }
      );

    return [
        method, {
        error,
        loading,
        data,
        called
      }
    ]
}
import { useLazyQuery, gql } from "@apollo/client";

const QUERY = gql`
    query ($email: String!, $password: String!) { 
      MemberLogin (loginCredentials: { email: $email, password: $password } ) { 
        ... on Member { 
          uuid 
          name 
          username 
          email 
          token 
          memberOf { 
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

export const MemberLogin = (email, password) => {
    const [method, {loading, error, data, called}] = useLazyQuery(
      QUERY, {
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
import { useQuery, gql } from "@apollo/client";


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
    const {error, loading, data} = useQuery(
        LOGIN_QUERY, {
          variables: {
            email, password
          }
        }
      );

    return {
        error,
        loading,
        data
    }
}
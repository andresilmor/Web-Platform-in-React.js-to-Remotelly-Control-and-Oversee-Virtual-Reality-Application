import { useLazyQuery, gql } from "@apollo/client";

const QUERY = gql`
    query ($institutionID: String) { 
        GetInstitutionPacients ( 
            institutionID: $institutionID
        ) { 
        ... on Pacient { 
          uuid
          name
          label
        }
      } 
}
  `

export const GetInstitutionPacients = (institutionID) => {
    const [method, {loading, error, data, called}] = useLazyQuery(
        QUERY, {
          variables: {
            institutionID
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
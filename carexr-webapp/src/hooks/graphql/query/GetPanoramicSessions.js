import { useLazyQuery, gql } from "@apollo/client";

const QUERY = gql`
    query ($institutionID: String, $panoramicID: String, $directedFor: [String], $externalFormat: Boolean) { 
      GetPanoramicSessions ( 
            institutionID: $institutionID, 
            panoramicID: $panoramicID, 
            directedFor: $directedFor 
            externalFormat: $externalFormat
        ) { 
        ... on PanoramicSession { 
          uuid
          label 
          imageUID
          imageHeight
          imageWidth
          partOf 
          directedFor
          meta {
            createdBy
            createdAt
            updatedAt
            isActive
          }
          mapping {
            boundingBox {
              x
              y
              width
              height
            }
            data {
                alias
                content
            }
          }
        } 
      } 
    }
  `

export const GetPanoramicSessions = (institutionID, panoramicID, directedFor, externalFormat = true) => {
    const [method, {loading, error, data, called}] = useLazyQuery(
        QUERY, {
          variables: {
            institutionID, panoramicID, directedFor, externalFormat
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
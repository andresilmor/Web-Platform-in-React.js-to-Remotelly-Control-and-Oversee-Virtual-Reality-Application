import { useLazyQuery, gql } from "@apollo/client";

const QUERY = gql`
    query ($institutionID: String, $hotspotID: String, $directedFor: [String], $externalFormat: Boolean) { 
        Get360Hotspot ( 
            institutionID: $institutionID, 
            hotspotID: $hotspotID, 
            directedFor: $directedFor 
            externalFormat: $externalFormat
        ) { 
        ... on Hotspot { 
          uuid
          label 
          image 
          partOf 
          directedFor
          meta {
            createdBy
            createdAt
            updatedAt
            isActive
          }
          mapping {
            transform {
                position {
                    x
                    y
                    z
                }
                scale {
                    width
                    height
                }
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

export const Get360Hotspot = (institutionID, hotspotID, directedFor, externalFormat = true) => {
    const [method, {loading, error, data, called}] = useLazyQuery(
        QUERY, {
          variables: {
            institutionID, hotspotID, directedFor, externalFormat
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
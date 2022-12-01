import { ApolloClient, InMemoryCache,split ,HttpLink} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from "@apollo/client/link/ws";


const httpLink = new HttpLink({
    uri: 'https://present-skylark-84.hasura.app/v1/graphql',
    headers: {
        "X-Hasura-Admin-Secret": "76QqCmzhVcN9hHOVRpwOFMlkVkhWmM5vMUR5epPyDtLRne5YRlr4OP4CGvotHMYj"
    }
  });

  



  const wsLink =
  typeof window !== "undefined"
      ? new WebSocketLink({
        uri: 'wss://present-skylark-84.hasura.app/v1/graphql',
        options:{
          reconnect:true,
          connectionParams:{
            headers: {
              'x-hasura-admin-secret': "76QqCmzhVcN9hHOVRpwOFMlkVkhWmM5vMUR5epPyDtLRne5YRlr4OP4CGvotHMYj"
            }
          }
        }
      })
      : null;





      const splitlink =
      typeof window !== "undefined" && wsLink != null
          ? split(
                  ({ query }) => {
                      const def = getMainDefinition(query);
                      return (
                          def.kind === "OperationDefinition" &&
                          def.operation === "subscription"
                      );
                  },
                  wsLink,
                  httpLink
            )
          : httpLink;
  


const client = new ApolloClient({
    link: splitlink,
  cache: new InMemoryCache(),

    
});

export default client;
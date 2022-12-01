import { gql } from '@apollo/client';

//  const client = new ApolloClient({
//   uri: 'https://present-skylark-84.hasura.app/v1/graphql',
//   cache: new InMemoryCache(),
//   headers: {
//       "X-Hasura-Admin-Secret": "76QqCmzhVcN9hHOVRpwOFMlkVkhWmM5vMUR5epPyDtLRne5YRlr4OP4CGvotHMYj"
//   }
// });




export const GET_ALL_CITIES = gql`
  subscription MyQuery {
    cities {
      id
      name
    }
  }
`;


export const GET_USER = gql`
subscription MyQuery {
    customers {
      id
      name
      role
      email
      city {
        id
        name
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
subscription MyQuery ($id:bigint){
    cities(where: {id: $id}) {
      name
      city {
        id
        name
      }
    }
  }
`;

export const ADD_USER =gql` mutation ADD_USER($name:String,$role:String,$email:String,$cityId:Int,) {
  insert_customers(objects: { name:$name, email:$email,role:$role,city_id:$cityId }) 
    {
      returning {
        name
        role
        email
        city_id
      }
    }
  }`;

  export const DELETE_USER =gql` mutation DELETE_USER($id:Int,$name:String,$role:String,$email:String,$cityId:Int) {
    delete_customers(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }`;

  export const UPDATE_USER =gql` mutation UPDATE_USER($id:Int,$name:String,$role:String,$email:String,$cityId:Int) {
    update_customers(where: {id: {_eq: $id}}, _set:{ name:$name, email:$email,role:$role,city_id:$cityId }) {
      affected_rows
    }
  }`;

  export const UPDATE_CITY =gql` mutation UPDATE_CITY($id:Int,$name:String) {
    update_cities(where: {id: {_eq: $id}}, _set:{ name:$name}) {
      affected_rows
    }
  }`;

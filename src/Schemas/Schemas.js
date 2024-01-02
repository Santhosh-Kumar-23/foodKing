import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
} from '@apollo/client';

//create a corresponding GraphQL mutation
export const GET_SUB_CATEGORIES = gql`
  query getSubCategoriesforCategories(
    $getSubCategoriesforCategoriesId: ID!
    $type: String
  ) {
    getSubCategoriesforCategories(
      id: $getSubCategoriesforCategoriesId
      type: $type
    ) {
      categoryId
      subCategories {
        id
        name
        description
        subCategoryType
        caution
        image
        price
        tax
        isFeatured
        status
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query Query {
    getAllCategories {
      name
      image
      id
    }
  }
`;

export const GET_FEATURED_ITEMS = gql`
  query IsFeatured {
    isFeatured {
      caution
      description
      id
      image
      name
      price
    }
  }
`;

export const GET_OFFRS = gql`
  query GetAllOffers {
    getAllOffers {
      id
      name
      discountPercentage
      startDate
      endDate
      image
      status
    }
  }
`;

export const GET_OFFRS_ID = gql`
  query getOfferById($getOfferByIdId: ID!) {
    getOfferById(id: $getOfferByIdId) {
      id
      name
      discountPercentage
      startDate
      endDate
      image
      status
      addItems {
        id
        name
        description
        subCategoryType
        caution
        image
        price
        tax
        isFeatured
        status
      }
    }
  }
`;
//search
export const GET_ALL_SUB_CATEGORIES = gql`
query Query($filter: String) {
  getAllSubCategories(filter: $filter) {
    id
    name
    description
    subCategoryType
    caution
    image
    price
    tax
    isFeatured
    status
    category {
      id
      name
      image
      subCategories {
        id
        name
        description
        subCategoryType
        caution
        image
        price
        tax
        isFeatured
        status
      }
    }
    subCategoryVariation {
      id
      attribute
      variations {
        id
        name
        add_price
        status
      }
    }
    subCategoryExtra {
      id
      name
      add_price
      status
      subCategoryId
    }
    addOns {
      id
      name
      description
      caution
      image
      price
      tax
      productId
      subCategoryId
    }
  }
}
`;

//get nest size , steak

export const GET_POP_UP_SUB_CATEGORIES = gql`
query getSubCategory($getSubCategoryId: ID!) {
  getSubCategory(id: $getSubCategoryId) {
    id
    name
    description
    caution
    image
    price
    tax
    status
    subCategoryType
    isFeatured
    subCategoryVariation {
      id
      attribute
      variations {
        id
        name
        add_price
        status
      }
    }
    addOns {
      id
      name
      description
      caution
      image
      price
      tax
      subCategoryVariation {
        id
        attribute
        variations {
          id
          name
          add_price
          status
        }
      }
      subCategoryExtra {
        id
        name
        add_price
        status
      }
      productId
      subCategoryId
     
    }
    subCategoryExtra {
      id
      name
      add_price
      status
      subCategoryId
    }
  }
}
`;

//add to cart

export const ADD_TO_CART = gql`
mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    id
    quantity
    subCategory {
      id
      name
      description
      subCategoryType
      caution
      image
      price
      tax
      isFeatured
      status
    }
    subCategoryExtra {
      id
      name
      add_price
      status
    }
    selectedVariation {
      id
      name
      add_price
      status
      subCategoryVariation {
        id
        attribute
      }
    }
    totalPrice
    user {
      id
      email
      phoneNo
      firstName
      lastName
      password
      confirmPassword
      role
      profileImage
    }
  }
}
`;


export const GET_ADD_CART = gql`
query Query($deviceToken: String) {
  getUserAddToCart(deviceToken: $deviceToken) {
    id
    quantity
    subCategory {
      id
      name
      description
      subCategoryType
      caution
      image
      price
      tax
      isFeatured
      status
      category {
        id
        name
        image
        subCategories {
          id
          name
          description
          subCategoryType
          caution
          image
          price
          tax
          isFeatured
          status
        }
      }
      subCategoryVariation {
        id
        attribute
        variations {
          id
          name
          add_price
          status
        }
      }
      addOns {
        id
        name
        description
        caution
        image
        price
        tax
        productId
        subCategoryId
      }
    }
    subCategoryExtra {
      id
      name
      add_price
      status
      subCategoryId
    }
    selectedVariation {
      id
      name
      add_price
      status
      subCategoryVariation {
        id
        attribute
      }
    }
    totalPrice
    user {
      id
      email
      phoneNo
      firstName
      lastName
      password
      confirmPassword
      role
      profileImage
    }
    deviceToken
  }
}
`;

export const UPDATE_ADD_CART = gql`
mutation updateCartItem($updateCartItemId: ID!, $operator: Int) {
  updateCartItem(id: $updateCartItemId, operator: $operator) {
    id
    quantity
    subCategory {
      id
      name
      description
      subCategoryType
      caution
      image
      price
      tax
      isFeatured
      status
     
    }
   
    subCategoryExtra {
      id
      name
      add_price
      status
    }
    selectedVariation {
      id
      name
      add_price
      status
      subCategoryVariation {
        id
        attribute
      }
    }
    totalPrice
    user {
      id
      email
      phoneNo
      firstName
      lastName
      password
      confirmPassword
      role
      profileImage
    }
  }
}
`;


export const ADD_CART_DELETE = gql`
mutation Mutation($addToCartDeleteId: ID!) {
  addToCartDelete(id: $addToCartDeleteId) {
    success
    message
  }
}
`;

export const PROCEED_TO_CHECKOUT = gql`
mutation Mutation($userId: ID) {
  proceedCheckout(userId: $userId) {
    addtoCart {
      id
      quantity
      subCategory {
        id
        name
        description
        subCategoryType
        caution
        image
        price
        tax
        isFeatured
        status
     
      }

      subCategoryExtra {
        id
        name
        add_price
        status
      }
      selectedVariation {
        id
        name
        add_price
        status
        subCategoryVariation {
          id
          attribute
        }
      }
      totalPrice
      user {
        id
        email
        phoneNo
        firstName
        lastName
        password
        confirmPassword
        role
        profileImage
      }
    }
    subTotal
  }
}
`;

export const GET_TIMINGS = gql`
query Query($date: String) {
  getTimings(date: $date) {
    date
    timings
  }
}
`;

export const UPDATE_USER = gql`
mutation Mutation($updateUserId: String!, $update: userUpdate) {
  updateUser(id: $updateUserId, update: $update) {
    data {
      confirmPassword
      email
      firstName
      id
      lastName
      password
      phoneNo
    }
  }
}
`;

export const CHNAGE_PASSWORD = gql`
mutation ChangePassword($input: ChangePassword) {
  changePassword(input: $input) {
    message
    data {
      id
      email
      phoneNo
      firstName
      lastName
      password
      confirmPassword
      role
      profileImage
    }
  }
}
`;

export const MOST_POPULAR_ITEMS = gql`
query GetPopularSubcategories {
  getPopularSubcategories {
    id
    name
    description
    subCategoryType
    caution
    image
    price
    tax
    isFeatured
    status
    subCategoryVariation {
      id
      attribute
      variations {
        id
        name
        add_price
        status
      }
    }
    subCategoryExtra {
      id
      name
      add_price
      status
      subCategoryId
    }
    addOns {
      id
      name
      description
      caution
      image
      price
      tax
      productId
      subCategoryId
    }
  }
}
`;



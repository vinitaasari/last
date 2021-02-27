// const awsmobile =  {
//     "aws_appsync_graphqlEndpoint": "https://bppij5xobnd3fbgpv7lyw3mqzi.appsync-api.eu-west-1.amazonaws.com/graphql",
//     "aws_appsync_region": "eu-west-1",
//     "aws_appsync_authenticationType": "API_KEY",
//     "aws_appsync_apiKey": "da2-bfjlq5bbsbfsznojk4iisljjty",
// };

const awsmobile =  {
    "aws_appsync_graphqlEndpoint": process.env.REACT_APP_AWS_GRAPHQL_ENDPOINT,
    "aws_appsync_region": process.env.REACT_APP_AWS_APPSYNC_REGION,
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": process.env.REACT_APP_AWS_APPSYNC_API_KEY,
};

export default awsmobile;
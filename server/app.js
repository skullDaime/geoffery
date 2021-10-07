const {Sequelize, DataTypes} = require('sequelize');
const {ApolloServer, gql} = require('apollo-server');
require('dotenv').config();

const dataBase = new Sequelize("postgres://postgres:0000@localhost:5432/geoffery");
dataBase.authenticate().then(console.log("Database: Geoffery, has been connected!")).catch((e)=>{console.log("Error in connection: "+e)});

//Models
const Content = dataBase.define('content',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    class: {type: DataTypes.STRING},
    content: {type: DataTypes.STRING, length:10000},
    createdAt: {type: DataTypes.DATE},
    updatedAt: {type: DataTypes.DATE},
});
//Associations

/*Schemas*/
const typeDefs = gql`
scalar Date
    type Content{
        id: ID
        class: String
        content: String
        createdAt: Date
        updatedAt: Date
    }

    type Query{
        readAllContent: [Content]
        readContent(id: Int):[Content]
    }

    input inputContent{
        id: ID
        class: String
        content: String
    }

    type Mutation{
        createContent(input: inputContent): [Content]
        updateContent(input: inputContent): [Content]
        destoyContent(input: inputContent): [Content]
    }
`;

/*resolvers */
const resolvers = {
    Query:{
        readAllContent() {return ReadAllContent()},
        readContent(_, args) {return ReadContent(args)},
    },
    Mutation:{
        createContent(_, args){return CreateContent(args)},
        updateContent(_, args){return UpdateContent(args)},
        destoyContent(_, args){return DestroyContent(args)}
    }
}
//Mutations #################################################################
/*
Create 
Content
id, class,content
*/
async function CreateContent(param){
    return await Content.create({
        id: param.input.id,
        class: param.input.class,
        content: param.input.content
    });
}
/*
Update 
Content
One
Find by ID
*/
async function UpdateContent(param){
    const object = await Content.findByPk(param.input.id);
    if (param.input.class){
        object.class = param.input.class;
    }
    if (param.input.content){
        object.content = param.input.content;
    }
    return await object.save();
}
/*
Delete 
Content
One
Find by ID
*/
async function DestroyContent(param){
    const object = await Content.findByPk(param.input.id);
    console.log(object[1]);
    return await object.destroy();
}
//Reads #################################################################
/*
Read 
Content
All
*/
async function ReadAllContent(){
    return await Content.findAll();
}
/*
Read 
Content
One
Find by ID
*/
async function ReadContent(param){
    return await Content.findAll({
        where:{id: param.id},
    });
}
//#######################################################################
/*Creating a server based in typeDefs and resolvers */
const server = new ApolloServer({typeDefs, resolvers});


/*Port listening and host URL callback*/
server.listen().then(({url})=>{
    console.log(`Server at: ${url}`);
})
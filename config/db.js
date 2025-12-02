import pkg from 'pg'
const {Pool} = pkg;

const connect = new Pool({
    host:"localhost",
    user:"postgres",
    database:"db_express",
    password:"28012021",
    port:"5432"
})

export default connect;
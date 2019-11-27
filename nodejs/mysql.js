// const fs = require('fs');

// function get(key){
//     fs.readFile("./db.json", (err, data) => {
//         const json = JSON.parse(data);
//         console.log(`get ${key} == ${json[key]}`)
//     })
// }

// get('name');

// function set(key, val){
//     fs.readFile("./db.json", (err, data) => {
//         const json = JSON.parse(data);
//         json[key] = val;
//         fs.writeFile('./db.json', JSON.stringify(json) , err => {
//             if(err) {
//                 console.error(err)
//             } else {
//                 console.log('写入成功===')
//             }
//         })
//     })
// }

// set("name", 'ABC');

// ==========================================

// const mysql = require('mysql');
// const cfg = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "spring_mysql",
//     database: "mydb"
// };

// const conn = mysql.createConnection(cfg);

// conn.connect(err => {
//     if (err) {
//       throw err;
//   } else { console.log("连接成功!");
//   } });

// const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
//     id INT NOT NULL AUTO_INCREMENT,
//     message VARCHAR(45) NULL,
//     PRIMARY KEY (id))`;
// const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`;
// const SELECT_SQL = `SELECT * FROM test`;

// conn.query(CREATE_SQL, err => {
//     if (err) {
//       throw err;
//     }
//     conn.query(INSERT_SQL, "hello world", (err, result) => {
//         if (err) {
//             throw err;
//           }
//         console.log(result);
//         conn.query(SELECT_SQL, (err, results) => {
//         console.log(results);
//         conn.end(); // 若query语句有嵌套，则end需在此执行 
//         })
//     })
// });

// ================================

// sequelize

(async () => {
    const Sequelize = require("sequelize");
    // 建立连接
    const sequelize = new Sequelize("mydb", "root", "spring_mysql", {
        host: "localhost",
        dialect: "mysql",
        operatorsAliases: false
    });
    // 定义模型
    const Fruit = sequelize.define("Fruit", {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV1,
            primaryKey: true
        },
        name: { type: Sequelize.STRING(20), allowNull: false },
        price: { 
            type: Sequelize.FLOAT,
             allowNull: false,
             validate: {
                isFloat: { msg: "价格字段请输入数字" },
                min: { args: [0], msg: "价格字段必须大于0" } 
            }
         },
        stock: { type: Sequelize.INTEGER, defaultValue: 0 }
    }, {
        timestamps: false
    });
    Fruit.sync({force: true})
    let ret = await Fruit.sync()
        console.log('sync',ret)
        ret = await Fruit.create({
            name: "香蕉",
            price: 3.5
        })
        console.log('create',ret)
        ret = await Fruit.findAll()
        await Fruit.update({price: 4 },{ where: { name:'香蕉'} } )
        console.log('findAll',JSON.stringify(ret))
        const Op = Sequelize.Op;
        ret = await Fruit.findAll({
            // where: { price: { [Op.lt]:4 }, stock: { [Op.gte]: 100 } }
            where: { price: { [Op.lt]: 4, [Op.gt]: 2 } }
        })
        console.log('findAll', JSON.stringify(ret, '', '\t'))
})()

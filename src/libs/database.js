import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'surveys' });

/**
 *  query:  is statement that will be executed 
 *  arguments: is an array of parameters that query
 *  Callback: is function that will be called when query is executed
 */
const transactionDB = async (query, argumentsList, return_data, callback) => {
    
    await db.transaction(function(txn) {
        txn.executeSql(
          query,
          argumentsList,
          (tx, results) => {
            if(return_data){             
              let data = [];
              for (let i = 0; i < results.rows.length; i++){
                data.push(results.rows.item(i));
              }
              callback(data);
            }
          },
          error => {
            console.warn(`Fallo el registro de la encuesta ${error.message}`);
          }
        );
    });
}

export default transactionDB;
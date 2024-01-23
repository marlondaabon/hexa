import transactionDB from "./database"; 

const transactionLogin = () => {

    transactionDB(`
        DROP TABLE IF EXISTS surveys
    `);

    transactionDB(`
        DROP TABLE IF EXISTS questions
    `);

    transactionDB(`
        CREATE TABLE IF NOT EXISTS  surveys ( 
            id INTEGER,
            title TEXT
        )
    `);

    transactionDB(`
        CREATE TABLE IF NOT EXISTS  questions ( 
            questionId TEXT,
            survey_id TEXT,
            questionText TEXT,
            questionType TEXT,
            placeholderText TEXT,
            options TEXT
        )
    `);

    transactionDB(`
        CREATE TABLE IF NOT EXISTS  answers ( 
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            answer TEXT,
            survey_id INTEGER,
            question_id INTEGER,
            user_id INTEGER,
            uri TEXT,
            lat TEXT,
            long TEXT,
            created_at TEXT
        )
    `);
}

export default transactionLogin;
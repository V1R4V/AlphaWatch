import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'companyDB', location: 'default' }, 
    () => { console.log('Database opened') }, 
    error => console.log(error)
);

export function getAllCompanies() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM Companies",
                [],
                (tx, results) => {
                    let companies = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        companies.push(results.rows.item(i));
                    }
                    resolve(companies);
                },
                (tx, error) => {
                    console.error("Failed to fetch companies", error);
                    reject([]);
                }
            );
        });
    });
}

export function getCompaniesByCbRank() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM Companies ORDER BY cb_rank ASC",
                [],
                (tx, results) => {
                    let companies = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        companies.push(results.rows.item(i));
                    }
                    resolve(companies);
                },
                (tx, error) => {
                    console.error("Failed to fetch companies by cb_rank", error);
                    reject([]);
                }
            );
        });
    });
}

export function getCompaniesByValue() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM Companies ORDER BY value_usd DESC NULLS LAST",
                [],
                (tx, results) => {
                    let companies = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        companies.push(results.rows.item(i));
                    }
                    resolve(companies);
                },
                (tx, error) => {
                    console.error("Failed to fetch companies by value_usd", error);
                    reject([]);
                }
            );
        });
    });
}

export function getCompaniesByNumInvestors() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM Companies ORDER BY LENGTH(investors) DESC NULLS LAST",
                [],
                (tx, results) => {
                    let companies = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        companies.push(results.rows.item(i));
                    }
                    resolve(companies);
                },
                (tx, error) => {
                    console.error("Failed to fetch companies by number of investors", error);
                    reject([]);
                }
            );
        });
    });
}






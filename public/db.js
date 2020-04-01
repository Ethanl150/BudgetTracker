if (indexedDB) {
    console.log('IndexedDB is supported');
}

const request = indexedDB.open('myBudget', 1);

request.onupgradeneeded = e => {
    const db = e.target.result

    const budgetTable = db.createObjectStore("myBudget", { keyPath: "id", autoIncrement: true })

    budgetTable.createIndex("nameOfTransaction", "name")
    budgetTable.createIndex("amount", "value")
    budgetTable.createIndex("time", "date")
    console.log('hello')
}

request.onsuccess = e => {
    let db = e.target.result

    const transaction = db.transaction(["myBudget"], "readwrite")
    const budgetTable = transaction.objectStore("myBudget")
    budgetTable.add({ name: "rent", value: "$700", date: Date.now() })
    budgetTable.add({ name: "groceries", value: "$50", date: Date.now() })
    // console.log(request.result)
    let getTransactions = budgetTable.getAll()
    getTransactions.onsuccess = (event) => {
        let data = event.target.result;
        console.log(data)
        fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).catch(function (err) {
            console.log(err)
        })
    }
}

request.onerror = e => {
    console.log(e.target.errorCode)
}
const url = 'http://localhost:8000/api/';

// PRODUCTS API

export function getProductsList(callback) {
    fetch(`${url}products`)
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function getProduct(id, callback) {
    fetch(`${url}products/${id}`)
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function deleteProduct(id, callback) {
    fetch(`${url}products/${id}`, {
        method: 'delete',
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function updateProduct(data, callback) {
    fetch(`${url}products/${data.id}`, {
        method: 'put',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

// CUSTOMERS API

export function deleteCustomer(customerId, callback) {
    fetch(`${url}customers/${customerId}`, {
        method: 'delete',
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function getCustomersList(callback) {
    fetch(`${url}customers`)
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function updateCustomer(data, callback) {
    fetch(`${url}customers/${data.id}`, {
        method: 'put',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

// INVOICES API

export function addInvoice(data, callback) {
    fetch(`${url}invoices`, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function addInvoiceItem(data, callback) {
    fetch(`${url}invoices/${data.invoice_id}/items`, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function updateInvoice(data, callback) {
    fetch(`${url}invoices/${data.invoice_id}`, {
        method: 'put',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function updateInvoiceItem(data, callback) {
    fetch(`${url}invoices/${data.invoice_id}/items/${data.id}`, {
        method: 'put',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}
export function deleteInvoiceItem(data, callback) {
    fetch(`${url}invoices/${data.invoice_id}/items/${data.id}`, {
        method: 'delete',
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function getInvoiceItems(id, callback) {
    fetch(`${url}invoices/${id}/items`)
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}
export function getInvoice(id, callback) {
    fetch(`${url}invoices/${id}`)
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function deleteInvoice(id, callback) {
    fetch(`${url}invoices/${id}`, {
        method: 'delete',
    })
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

export function getInvoicesList(callback) {
    fetch(`${url}invoices`)
        .then(res => res.json())
        .then((result) => {
            callback(result);
        })
}

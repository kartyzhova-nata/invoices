import React, {Component} from 'react';
import {
    getInvoicesList,
    deleteInvoice,
    getInvoiceItems,
    getInvoice,
    getProduct
} from '../api';
import InvoiceForm from "./InvoiceForm";


class Invoices extends Component {
    constructor() {
        super();
        this.state = {
            invoicesList: [],
            showInvoiceForm: false,
            editedInvoiceData: null
        };
        this.addItemIntoList = this.addItemIntoList.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }

    componentWillMount() {
        this.getInvoicesList();
    }
    getInvoicesList () {
        getInvoicesList((result) => {
            this.setState({
                invoicesList: result
            });
        })
    }

    addItemIntoList(item) {
        let tempArr = [];

        /* Copy array */
        this.state.invoicesList.forEach((el) => {
            tempArr.push(el);
        });
        tempArr.push(item);
        this.setState({
            invoicesList: tempArr
        });
        this.toggleForm(false);
    }

    deleteInvoice(id) {
        if (!confirm("Do you really want to delete this invoice?")) {
            return;
        }

        deleteInvoice(id, (result) => {
            let id = result.id;
            let tempArr = [];

            /* Copy array */
            this.state.invoicesList.forEach((el) => {
                tempArr.push(el);
            });

            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].id === id) {
                    tempArr.splice(i, 1);
                    break;
                }
            }

            this.setState({
                invoicesList: tempArr
            });
        })
    }

    editInvoice(id) {
        getInvoice(id, (invoice) => {
            getInvoiceItems(id, (invoiceItems) => {
                invoiceItems.forEach((el) => {
                    getProduct(el.product_id, (invoiceItems) => {
                        el.name = invoiceItems.name;
                        el.price = invoiceItems.price;
                    });
                });
                let editedInvoiceData = {
                    invoice: invoice,
                    invoiceItems: invoiceItems
                };
                this.setState({
                    editedInvoiceData: editedInvoiceData
                }, () => {
                    this.toggleForm(true);
                });
            });
        });
    }

    renderInvoicesList() {
        return (
            <tbody>
            {this.state.invoicesList.map((invoice, index) => {
                return (
                    <tr key={index}>
                        <td className="edit-btn">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                this.editInvoice(invoice.id)
                            }}>
                                <span className="glyphicon glyphicon-search"></span>
                            </button>
                        </td>
                        <td>{invoice.id}</td>
                        <td>{invoice.discount}</td>
                        <td>{invoice.total}</td>
                        <td className="delete-btn">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                this.deleteInvoice(invoice.id)
                            }}>
                                <span className="glyphicon glyphicon-remove"></span>
                            </button>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        )
    }

    toggleForm(action) {
        this.setState({showInvoiceForm: action});
    }

    closeForm() {
        this.toggleForm(false);
        this.setState({
                editedInvoiceData: null
            }
            , this.getInvoicesList);
    }

    render() {
        return (
            <div>
                <button className="btn" onClick={() => {
                    this.toggleForm(true)
                }}>Create invoice
                </button>
                <span>&nbsp;&nbsp;</span>
                {this.state.showInvoiceForm &&
                <button type="button" className="btn" onClick={this.closeForm}>Close</button>}
                {this.state.showInvoiceForm &&
                <InvoiceForm addItemIntoList={this.addItemIntoList} invoiceToEdit={this.state.editedInvoiceData}/>}

                <table className="table table-hover table-bordered invoices-table">
                    <thead>
                    <tr>
                        <th>Show</th>
                        <th>Invoice ID</th>
                        <th>Discount,%</th>
                        <th>Total,USD</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    {this.renderInvoicesList()}
                </table>
            </div>
        )
    }
}

export default Invoices;
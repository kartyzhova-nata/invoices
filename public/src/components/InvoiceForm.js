import React, {Component} from 'react';
import {
    getCustomersList,
    getProductsList,
    addInvoice,
    getProduct,
    addInvoiceItem,
    deleteInvoiceItem,
    updateInvoice,
    updateInvoiceItem
} from '../api';

class InvoiceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customersList: [],
            productsList: [],
            discount: 0,
            total: 0,
            customerId: 0,
            invoiceItems: [],
            selectedProduct: null,
            quantity: 1,
            invoiceId: 0,
        };

        this.createInvoice = this.createInvoice.bind(this);
        this.setCustomer = this.setCustomer.bind(this);
    }


    componentWillMount() {
        let invoiceToEdit = this.props.invoiceToEdit;

        getCustomersList((result) => {
            this.setState({
                customersList: result
            });
        });
        getProductsList((result) => {
            this.setState({
                productsList: result
            });
        });

        if (invoiceToEdit) {
            this.setState({
                invoiceId: invoiceToEdit.invoice.id,
                customerId: invoiceToEdit.invoice.customer_id,
                discount: invoiceToEdit.invoice.discount,
                total: invoiceToEdit.invoice.total,
                invoiceItems:invoiceToEdit.invoiceItems
            });
        }
    }

    /*set discount for invoice*/
    setDiscount(event) {
        let discount = +event.target.value;
        if (discount<0 || discount>100)  {
            alert("Discount value can't be less then 0 and more then 100!");
            this.setState({
                discount: '0'
            }, this.calculateTotal);
            return;
        }

        this.setState({
            discount: +event.target.value + ''
        }, this.calculateTotal);

    }

    /*save selected product value*/
    setProduct(event) {
        let productID = +event.target.value;
        getProduct(productID, (result) => {
            this.setState({
                selectedProduct: result
            });
        });
    }

    /*set quantity for selected product*/
    setQuantity(event) {
        let decimal=  /^[0-9]+\.[0-9]+$/;
        let quantity =  event.target.value;
        if (quantity === "") {
            this.setState({
                quantity: '1'
            });
            return;
        }
        if ((+quantity <= 0) || (quantity).match(decimal)) {
            alert("Please enter integer number > 0!");
            this.setState({
                quantity: '1'
            });
            return;
        }

        this.setState({
            quantity: +quantity + ''
        });
    }

    /*add product(invoice item) to the list of products(invoice items of appropriate invoice)*/
    addProduct() {
        let tempArr = [];

        let productToAdd = this.state.selectedProduct;
        if (!productToAdd) {
            alert("Please add at least one product!");
            return;
        }

        /* Copy array and check existence*/
        let invoiceItems = this.state.invoiceItems;
        let productToAddId = productToAdd.id;
        for (let i = 0; i < invoiceItems.length; i++) {
            let el = invoiceItems[i];
            if (el.id === productToAddId) {
                alert(`The product has been already added  to the product list. Please choose another one or edit quantity of existed one`);
                return;
            }
            tempArr.push(el);
        }

        productToAdd.quantity = this.state.quantity;
        productToAdd.isEditMode = false;
        tempArr.push(productToAdd);

        this.setState({
            invoiceItems: tempArr
        }, () => {
            this.calculateTotal();
        });

        addInvoiceItem({
            invoice_id: this.state.invoiceId,
            product_id: productToAddId,
            quantity: productToAdd.quantity,
        }, () => {
        });
    }

    /*enable edit mode for selected product(invoice item)*/
    editInvoiceItem(data) {
        let tempArr = [];

        /* Copy array */
        this.state.invoiceItems.forEach((el) => {
            tempArr.push(el);
        });
        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].id === data.id) {
                tempArr[i].isEditMode = true;
                break;
            }
        }
        this.setState({
            invoiceItems: tempArr
        });
    }

    /*update product data*/
    updateInvoiceItem(data) {
        let invoiceItems = this.state.invoiceItems;

        for (let i = 0; i < invoiceItems.length; i++) {
            if (invoiceItems[i].id === data.id) {
                let decimal=  /^[0-9]+\.[0-9]+$/;
                let quantity =   invoiceItems[i].quantity;

                if ((quantity <= 0) || (""+quantity).match(decimal)) {
                    alert("Please enter integer number > 0!");
                    this.setState({
                        quantity: '1'
                    });
                    return;
                }
                invoiceItems[i].isEditMode = false;
                break;
            }
        }

        this.calculateTotal();
        if (this.props.invoiceToEdit) {
            updateInvoiceItem(data, ()=>{});
        }
    }

    /*delete product from the invoice*/
    deleteInvoiceItem(id) {
        if (!confirm("Do you really want to delete this product from the invoice?")) {
            return;
        }

        let tempArr = [];

        /* Copy array */
        this.state.invoiceItems.forEach((el) => {
            tempArr.push(el);
        });

        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].id === id) {
                tempArr.splice(i, 1);
                break;
            }
        }

        this.setState({
            invoiceItems: tempArr
        }, this.calculateTotal);

        if (this.props.invoiceToEdit) {
            deleteInvoiceItem({
                invoice_id: this.state.invoiceId,
                id: id
            }, ()=>{});
        }
    }

    /*update invoice data via API*/
    updateInvoiceAPI () {
        if (!this.props.invoiceToEdit) {
            return;
        }
        updateInvoice({
            invoice_id: this.state.invoiceId,
            customer_id: this.state.customerId,
            total: this.state.total,
            discount: this.state.discount,
        }, ()=>{})
    }

    /*calculate invoice total value*/
    calculateTotal() {
        let products = this.state.invoiceItems;
        let total = 0;
        products.forEach((el) => {
            total += el.price * el.quantity
        });

        if (this.state.discount) {
            total *= (100 - this.state.discount) / 100;
        }

        this.setState({
            total: (total).toFixed(2)
        }, this.updateInvoiceAPI);
    }

    /*create new invoice*/
    createInvoice(event) {
        event.preventDefault();

        if (this.props.invoiceToEdit){
            return;
        }

        if (this.state.customerId === 0) {
            alert("Please specify the customer!");
            return;
        }
        let data = {
            customer_id: this.state.customerId,
            discount: this.state.discount,
            total: this.state.total,
        };

        if (this.state.invoiceItems.length === 0) {
            alert("Please add at least one product!");
            return;
        }
        addInvoice(data, (result) => {
            let invoiceID = result.id;
            let invoiceItems = this.state.invoiceItems;
            invoiceItems.forEach((el) => {
                let addItemData = {
                    invoice_id: invoiceID,
                    product_id: el.id,
                    quantity: el.quantity,
                };
                addInvoiceItem(addItemData, () => {
                });
            });
            this.props.addItemIntoList(result);
        })
    }

    /*select customer*/
    setCustomer(event) {
        this.setState({
            customerId: +event.target.value
        }, this.updateInvoiceAPI);
    }

    render() {
        return (
            <form className="form-horizontal invoice-form" onSubmit={this.createInvoice}>
                <div className="form-group">
                    <label htmlFor="customerSelect"
                           className="control-label col-sm-offset-3 col-sm-1">Customer: </label>
                    <div className="col-sm-5">
                        <select id="customerSelect"  value={this.state.customerId} className="form-control"
                                onChange={this.setCustomer}>
                            <option value={0}  disabled>Please select customer</option>
                            {this.state.customersList.map((customer,index) => {
                                return (
                                    <option key={index} value={customer.id} >{customer.name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className="invoice-items">
                    <div className="form-group">
                        <label htmlFor="productSelect"
                               className="control-label col-sm-offset-3 col-sm-1">Products: </label>
                        <div className="col-sm-5">
                            <select id="productSelect" defaultValue="0" className="form-control" onChange={(event) => {
                                this.setProduct(event)
                            }}>
                                <option value="0" disabled >Please select product</option>
                                {this.state.productsList.map((product,index) => {
                                    return (
                                        <option key={index} value={product.id}>{product.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity" className="control-label col-sm-offset-3 col-sm-1">Quantity: </label>
                        <div className="col-sm-5">
                            <input type="number" id="quantity" className="form-control" onChange={(event) => {
                                this.setQuantity(event)
                            }}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-10">
                            <button type="button" className="btn" onClick={() => {
                                this.addProduct()
                            }}>Add Product
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <table className="table table-hover table-bordered invoices-table">
                        <thead>
                        <tr>
                            <th className="edit-btn">Edit</th>
                            <th>Product</th>
                            <th>Price,USD</th>
                            <th>Quantity</th>
                            <th className="delete-btn">Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.invoiceItems.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <button type="button" className="btn btn-primary" onClick={() => {
                                            this.editInvoiceItem(item)
                                        }}>
                                            <span className="glyphicon glyphicon-edit"></span>
                                        </button>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.isEditMode ? (<input type="number" className="form-control" defaultValue={item.quantity} onChange={(event) => {
                                        item.quantity = +event.target.value
                                    }}/>) : item.quantity}</td>
                                    <td className="delete-btn">
                                        {item.isEditMode ? (
                                                <button type="button" className="btn btn-primary" onClick={() => {
                                                    this.updateInvoiceItem(item)
                                                }}>
                                                    <span className="glyphicon glyphicon-ok"></span>
                                                </button>
                                            ) :
                                            (
                                                <button type="button" className="btn btn-primary" onClick={() => {
                                                    this.deleteInvoiceItem(item.id)
                                                }}>
                                                    <span className="glyphicon glyphicon-remove"></span>
                                                </button>
                                            )}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="form-group">
                    <label htmlFor="discount" className="control-label col-sm-offset-3 col-sm-1">Discount,%: </label>
                    <div className="col-sm-5">
                        <input type="number" id="discount" className="form-control" value={this.state.discount}
                               onChange={(event) => {
                                   this.setDiscount(event)
                               }}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label col-sm-offset-3 col-sm-1">Total,USD: </label>
                    <div className="col-sm-5">
                        <span className="form-control">{this.state.total}</span>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-4 col-sm-10">
                        {this.props.invoiceToEdit ? "" : (<button type="submit" className="btn">Submit</button>)}
                    </div>
                </div>
            </form>
        )
    }
}

export default InvoiceForm;
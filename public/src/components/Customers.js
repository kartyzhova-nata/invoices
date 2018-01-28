import React, {Component} from 'react';
import {getCustomersList, deleteCustomer, updateCustomer} from '../api';

class Customers extends Component {
    constructor() {
        super();

        this.state = {
            customersList: []
        }
    }

    componentWillMount() {
        getCustomersList((result) => {
            result.forEach((el) => {
                el.isEditMode = false
            });

            this.setState({
                customersList: result
            });
        })
    }

    /*update selected customer*/
    updateCustomer(data) {
        updateCustomer(data, (result) => {
            let id = result.id;
            let tempArr = [];

            /* Copy array */
            this.state.customersList.forEach((el) => {
                tempArr.push(el);
            });

            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].id === id) {
                    result.isEditMode = false;
                    tempArr[i] = result;
                    break;
                }
            }

            this.setState({
                customersList: tempArr
            });
        })
    }

    /*enable edit mode for selected customer*/
    editCustomer(data) {
        let tempArr = [];

        /* Copy array */
        this.state.customersList.forEach((el) => {
            tempArr.push(el);
        });
        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].id === data.id) {
                tempArr[i].isEditMode = true;
                break;
            }
        }
        this.setState({
            customersList: tempArr
        });
    }

    renderCustomersList() {
        return (
            <tbody>
            {this.state.customersList.map((customer, index) => {
                return (
                    <tr key={index} id={customer.id}>
                        <td className="edit-btn">
                            { customer.isEditMode ? (
                                <button className="btn btn-primary" onClick={() => {this.updateCustomer(customer)}}>
                                    <span className="glyphicon glyphicon-ok"></span>
                                </button>
                                ) :
                                <button className="btn btn-primary" onClick={() => {this.editCustomer(customer)}}>
                                    <span className="glyphicon glyphicon-edit"></span>
                                </button>
                            }
                        </td>
                        <td>{customer.isEditMode ? (<input className="form-control" defaultValue={customer.name} onChange={(event) => {
                            customer.name = event.target.value
                        }}/>) : customer.name}</td>
                        <td>{customer.isEditMode ? (<input className="form-control" defaultValue={customer.address} onChange={(event) => {
                            customer.address = event.target.value
                        }}/>) : customer.address}</td>
                        <td>{customer.isEditMode ? (<input className="form-control"  defaultValue={customer.phone} onChange={(event) => {
                            customer.phone = event.target.value
                        }}/>) : customer.phone}</td>
                    </tr>
                )
            })}
            </tbody>
        )
    }

    render() {
        return (
            <table className="table table-hover table-bordered">
                <thead>
                <tr>
                    <th>Edit</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                </tr>
                </thead>
                {this.renderCustomersList()}
            </table>
        )
    }
}

export default Customers;
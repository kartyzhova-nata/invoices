import React, {Component} from 'react';
import {getProductsList, deleteProduct, updateProduct} from '../api';

class Products extends Component {
    constructor() {
        super();

        this.state = {
            productsList: []
        }

    }

    componentWillMount() {
        getProductsList((result) => {
            result.forEach((el) => {
                el.isEditMode = false
            });

            this.setState({
                productsList: result
            })
        })
    }

    /*update selected product*/
    updateProduct(data) {
        updateProduct(data, (result) => {
            let id = result.id;
            let tempArr = [];

            /* Copy array */
            this.state.productsList.forEach((el) => {
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
                productsList: tempArr
            });
        })
    }

    /*enable edit mode for selected product*/
    editProduct(data) {
        let tempArr = [];

        /* Copy array */
        this.state.productsList.forEach((el) => {
            tempArr.push(el);
        });
        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].id === data.id) {
                tempArr[i].isEditMode = true;
                break;
            }
        }
        this.setState({
            prodsList: tempArr
        });
    }

    renderProductsList() {
        return (
            <tbody>
            {this.state.productsList.map((product, index) => {
                return (
                    <tr key={index}>
                        <td className="edit-btn">
                            { product.isEditMode ? (
                                    <button className="btn btn-primary" onClick={() => {this.updateProduct(product)}}>
                                        <span className="glyphicon glyphicon-ok"></span>
                                    </button>
                                ) :
                                (
                                    <button className="btn btn-primary" onClick={() => {this.editProduct(product)}}>
                                        <span className="glyphicon glyphicon-edit"></span>
                                    </button>
                                )}
                        </td>
                        <td>{product.isEditMode ? (<input defaultValue={product.name} onChange={(event) => {
                            product.name = event.target.value
                        }}/>) : product.name}</td>
                        <td>{product.isEditMode ? (<input type="number" defaultValue={product.price} onChange={(event) => {
                            product.price = +event.target.value
                        }}/>) : product.price}</td>
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
                    <th>Product</th>
                    <th>Price,USD</th>
                </tr>
                </thead>
                {this.renderProductsList()}
            </table>
        )
    }
}

export default Products;
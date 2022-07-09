import React, { Component } from 'react';
import { IconName } from "react-icons/fa";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <div className='App'>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <FontAwesomeIcon icon="fa-thin fa-envelope" />
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>

                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

    
}

export default LoginPage;
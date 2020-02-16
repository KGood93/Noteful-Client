import React from 'react'
import './AddFolder.css'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationError/validationError'
import PropTypes from 'prop-types'

class AddFolder extends React.Component {
    static contextType = ApiContext;

    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: '',
                touched: false
            }
        }
    }
    
    updateName(folderName) {
        this.setState({name: {value: folderName, touched: true}})
    }

    handleSubmit = event => {
        event.preventDefault();
        const {name} = this.state;
        
        console.log('Name: ', name.value);

        const folderName = {
            name: name.value
        }

        console.log("folder Name: ", folderName)

        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(folderName)
           })
           .then(res => {
               if (!res.ok) {
                   return res.json().then(event => Promise.reject(event))
               }
               return res.json()
           })
           .then(folder => {
               this.context.addFolder(folder)
               this.props.history.push(`/folder/${folder.id}`)
           })
           .catch(error => {
               console.error({ error })
           })
    }
    
    validateName() {
        const name = this.state.name.value.trim();
        if(name.length === 0) {
            return 'Folder Name Required'
        }
    }

    render() {
        const nameError = this.validateName();
        return (
            <section className='AddFolder'>
            <h2>Add Folder</h2>
            <NotefulForm className='FolderAddition' onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="FolderName">Folder Name</label>
                    <input 
                        type="text"
                        className="folder__control"
                        name="FolderName"
                        id="FolderName" 
                        onChange={e => this.updateName(e.target.value)}
                        />
                        {this.state.name.touched && <ValidationError message={nameError} />}
                </div>
                <div className="addition_button">
                    <button
                        type="submit"
                        disabled={
                            this.validateName()
                        }
                    >
                        Add Folder
                    </button>
                </div>
            </NotefulForm>
            </section>
        )
    }
}

AddFolder.defaultProps = {
    history: {
        push: () => {}
    }
}

AddFolder.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    })
}

export default AddFolder
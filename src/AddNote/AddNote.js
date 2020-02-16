import React from 'react'
import './AddNote.css'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationError/validationError'

class AddNote extends React.Component {
    static contextType = ApiContext;

    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: '',
                touched: false
            },
            content: {
                value: '',
                touched: false
            },
            folderId: {
                value: '',
                touched: false
            }
       }
    }

    static defaultProps = {
        history: {
            push: () => {}
        }
    }

    updateName(noteName) {
        this.setState({name: {value: noteName, touched: true}});
    }

    updateContent(noteContent) {
        this.setState({content: {value: noteContent, touched: true}});
    }

    updateFolder(folderSelect) {
        this.setState({folderId: {value: folderSelect, touched: true}});
    }
    
    handleSubmit = event => {
        event.preventDefault();
        const { name, content, folderId } = this.state;

        console.log("Name:", name.value);
        console.log("Content:", content.value);
        console.log("FolderId:", folderId.value);

        const note = {
            name: name.value,
            content: content.value,
            folderId: folderId.value,
            modified: new Date()
        }
        console.log('Note: ', note);

        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(note)
           })
           .then(res => {
               if (!res.ok) {
                   return res.json().then(event => Promise.reject(event))
               }
               return res.json()
           })
           .then(note => {
               this.context.addNote(note)
               this.props.history.push(`/notes/${note.folderId}`)
           })
           .catch(error => {
               console.error({ error })
           })
    }

    //Validate Name is not left blank
    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return "Name is Required"
        }
    }
    
    //Validate Folder Selected
    validateFolder() {
        const folder = this.state.folderId.value.trim();
        if (folder.value === 'null') {
            return "Please Select Folder"
        }
    }
    
    render() {
        const { folders=[] } = this.context;
        const nameError = this.validateName();
        const folderError = this.validateFolder();

        return (
            <section className='AddNote'>
            <h2>Add Note</h2>
            <NotefulForm className='NoteAddition' onSubmit={this.handleSubmit}>
                <div className="Note-name">
                    <label htmlFor="NoteName">Name</label>
                    <input 
                        type="text"
                        className="Note__control"
                        name="noteName"
                        id="noteName"
                        onChange={e => this.updateName(e.target.value)}
                        />
                        {this.state.name.touched && <ValidationError message={nameError} />}
                </div>
                <div className="Note-content">
                    <label htmlFor="NoteContent">Content</label>
                    <textarea 
                        name="noteContent"
                        id="noteContent"
                        onChange={e => this.updateContent(e.target.value)}
                        >
                    </textarea>
                </div>
                <div className="folder-Select">
                    <label htmlFor="SelectFolder">Select Folder</label>
                    <select 
                        name="folderSelect" 
                        id="folderSelect" 
                        onChange={e => this.updateFolder(e.target.value)}
                        >
                        <option value={'null'}>...</option>
                        {folders.map(folder => 
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                        )}
                    </select>
                    {this.state.folderId.touched && <ValidationError message={folderError} />}
                </div>
                <div className="addition_button">
                    <button 
                        type="submit"
                        disabled={
                            this.validateName() || 
                            this.validateFolder()
                        }
                        >
                        Add Note
                    </button>
                </div>
            </NotefulForm>
            </section>
        )
    }
}

export default AddNote
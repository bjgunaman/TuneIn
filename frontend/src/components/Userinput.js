import Rect from 'react';


const Userinput = (props) => {
    return (
        <div className="input-send">
            <input className="input-item" value={props.message}></input>
        </div>
    );
}
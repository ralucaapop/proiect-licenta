import '../assets/css/card.css';

function Card(props){

    return(
        <div className="card" onClick={props.onClick} style={{ cursor: 'pointer' }}>
            <h1 className="cardTitle">{props.title}</h1>
            <img className="cardImage" src={props.image_source} alt="appointment image"></img>

        </div>
    );

}

export default Card;

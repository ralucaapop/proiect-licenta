function IserGreeting(props){
    if(props.isLoggedI){
        return <h2>Welcome {props.username}</h2>
    }
    else{
        return<h2>Please Log in to contiunue</h2>
    }
}

IserGreeting.defaultProps ={
    isLoggedIn: false,
    username:"unknown"
}
export default IserGreeting
function List(props){
    const itemList = props.items;
    const category = props.category
    //fruits.sort((a,b)=> a.name.localeCompare(b.name));//alphabetical
    //fruits.sort((a,b)=> b.name.localeCompare(a.name));//invers alphabetical
    //fruits.sort((a,b)=> a.calories -b.calories);//numeric order

    const lowCalFriuts = itemList.filter(fruit => fruit.calories <100); //filter

    const listItems = lowCalFriuts.map(fruit => <li key={fruit.id}>
        {fruit.name}: &nbsp;
        <b>{fruit.calories}</b></li>);


    return(<ol>{listItems}</ol>)
}
export default List;
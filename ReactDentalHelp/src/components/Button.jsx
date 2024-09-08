import styles from '../assets/css/Button.module.css';
function Button(){

    let count = 0;
    const handelClock = (name) => {
        if(count <3)
        {
            count++;
            console.log(`${name} you clicked me ${count}  time/s`);
        }
        else{
            console.log(`${name} stop clicking me`);
        }
    };
    const handleClick2= (name) => console.log(`${name} stop clocking me`);

    const handleButton3 = (e) =>{
        e.target.textContent ="ouch";
    };

    return(
        <>
            <button onClick={() =>handleClick2("raluca")} className={styles.button}>Click me</button>
            <button onClick={ () =>handelClock("ralu")}>
               buton2
            </button>
            <button onDoubleClick={(e) => handleButton3(e)}>button3</button>
            // same with simple click


        </>
    );
}

export default Button;
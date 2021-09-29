import styles from "./Card.module.css"

const Card = (props) => {
  console.log(props.inIt)
  return (
    <div id={props.id} className={styles.cont + " " +(props.inIt ? styles.yes : "")} onClick={(event)=>{
      if (event.target.className!==props.btn)props.onClick(event)
      }}>
      <h2>{props.title}</h2>
      <span>Current Retention = <span className={styles.red}>{props.retention}</span> </span>
      <span>Last Revised = <span className={styles.red}>{props.lastRev}</span> </span>
      <span>Times Revised = <span className={styles.red}>{props.timesRev}</span> </span><br />
      <button onClick={()=>{
        props.addRev()
      }} style={{"backgroundColor": "red", "width":"20%"}} className={props.btn}>Add Revision</button>
    </div>
  )
}

export default Card

import styles from "./Card.module.css"

const Card = (props) => {
  return (
    <div className={styles.cont}>
      <h2>{props.title}</h2>
      <span>Current Retention = <span className={styles.red}>{props.retention}</span> </span>
      <span>Last Revised = <span className={styles.red}>{props.lastRev}</span> </span>
      <span>Times Revised = <span className={styles.red}>{props.timesRev}</span> </span><br />
      <button onClick={()=>{props.addRev()}} style={{"backgroundColor": "red", "width":"20%"}} className={props.btn}>Add Revision</button>
    </div>
  )
}

export default Card

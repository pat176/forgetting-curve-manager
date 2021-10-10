import { useState } from "react"
import styles from "./Card.module.css"
const find = (arr, el) => {
  let out = -1
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    if (JSON.stringify(element) === JSON.stringify(el)) {
      out = index
      break
    }
  }
  // //console.log(el," still here")
  return out
}
const Card = (props) => {
  const [state, setstate] = useState({open: false, notes: false, dpp: false})
  console.log(props.inIt)
  return (
    <div id={props.id} className={styles.cont + " " +(props.inIt ? styles.yes : "")} onClick={(event)=>{
      console.log(event.target.id)
      if (find([props.id,"btn "+props.id, "span1 " + props.id, "span2 " + props.id], event.target.id)===-1)props.onClick(event)
      }}>
      <h2>{props.title}</h2>
      <span>Current Retention = <span className={styles.red}>{props.retention}</span> </span>
      <span>Last Revised = <span className={styles.red}>{props.lastRev}</span> </span>
      <span>Times Revised = <span className={styles.red}>{props.timesRev}</span> </span><br />
      {state.open ? (
        <div className={styles.check}>
          <span id={"span1 "+props.id} className={styles.span + " " + (state.notes ? styles.notes : "")} onClick={()=>{
            let notes = state.notes
            setstate({...state, notes: !notes})
          }}>Notes Revised?</span>
          <span id={"span2 "+props.id} className={styles.span  + " " + (state.dpp ? styles.dpp : "")} onClick={()=>{
            let dpp = state.dpp
            console.log(dpp)
            setstate({...state, dpp: !dpp})
          }}>DPP Done?</span>
        </div>
      ) : ""}
      <button id={"btn "+props.id} onClick={()=>{
        if (state.notes && state.dpp) {
          props.addRev()
          setstate({
            open: false
          })
        } else if (!(state.open)) {
          setstate({
            open: true
          })
        } else {
          alert("Revise Both Notes And DPP")
        }
      }} style={{"backgroundColor": "red", "width":"20%"}} className={props.btn}>Add Revision</button>
    </div>
  )
}

export default Card

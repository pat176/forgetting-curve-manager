import { useEffect } from "react"
import styles from "./Curve.module.css"

const Curve = () => {
  useEffect(() => {
    let elt = document.getElementById("curve");
    //console.log(elt)
    if (elt) {
      let calculator = Desmos.GraphingCalculator(elt);
      calculator.setExpression({ id: 'graph1', latex: 'y=e^{-x/10}', lockViewport: "true" });
      calculator.setMathBounds({
        left: 0,
        right: 10,
        bottom: 0,
        top: 1
      });
      //console.log("here")
      //console.log(elt)
      //console.log(Desmos)
    }
  }, [])
  return (
    <div>
      <div className={styles.over}></div>
      <div className={styles.curve} id="curve"></div>
    </div>
  )
}

export default Curve

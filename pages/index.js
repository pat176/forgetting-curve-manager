import Head from 'next/head'
import { useEffect, useState } from 'react'
import Card from '../components/Card/Card'
import styles from '../styles/Home.module.css'
import moment from "moment"
const d = new Date();
const find = (arr, el) => {
  let out = -1
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    if (JSON.stringify(element) === JSON.stringify(el)) {
      out = index
      break
    }
  }
  // //////console.log(el," still here")
  return out
}
const diffInDays = (date1, date2) => {
  let a = moment(date1, 'YYYY/MM/DD');
  let b = moment(date2, 'YYYY/MM/DD');
  let diffDays = b.diff(a, 'days');
  //////console.log(diffDays)
  return diffDays
}
const getYYYYMMDD = (date) => {
  const arr = date.split("/")
  let year = arr[2]
  let day = arr[1]
  let month = arr[0]
  while (year.length !== 4) {
    year = "0" + year
  }
  while (day.length !== 2) {
    day = "0" + day
  }
  while (month.length !== 2) {
    month = "0" + month
  }
  return year + "-" + month + "-" + day
}
export default function Home() {
  const [state, setstate] = useState({
    search: "",
    text: "",
    lastRev: getYYYYMMDD(d.toLocaleDateString()),
    timesRev: 0,
    open: false,
    recordArr: [],
    syllabus: [],
    target: 0,
    ind: 0
  });
  useEffect(() => {
    if (localStorage.getItem("ind") && localStorage.getItem("target")) {
      setstate({
        ...state,
        ind: JSON.parse(localStorage.getItem("ind")),
        target: JSON.parse(localStorage.getItem("target"))
      })
    }
    if (localStorage.getItem("records")) {

      // diffInDays("2020/11/11", getYYYYMMDD(d.toLocaleDateString()))
      setstate((prevstate) => {
        if (localStorage.getItem("syllabus")) {

          return ({
            ...state,
            syllabus: JSON.parse(localStorage.getItem("syllabus")),
            recordArr: JSON.parse(localStorage.getItem("records"))
          })
        } else {
          localStorage.setItem("syllabus", JSON.stringify([]))
          return ({
            ...state,
            recordArr: JSON.parse(localStorage.getItem("records"))
          })
        }
      }
      )
    } else {
      //////console.log("here")
      localStorage.setItem("records", JSON.stringify([]))
    }
  }, [])
  useEffect(() => {
    //////console.log(state.recordArr)
    if (state.recordArr !== undefined) {

      if (state.recordArr.length !== 0) {
        //////console.log("object")
        localStorage.setItem("records", JSON.stringify(state.recordArr))
        setstate({ ...state, ind: target(state.target) })
      }
    }
  }, [state.recordArr])
  const target = (targ) => {
    let index = null
    localStorage.setItem("target", targ)
    let tmp = expectedMarks(state.syllabus)
    state.recordArr.sort((a, b) => (
      (Math.exp(-(diffInDays(a.lastRev, getYYYYMMDD(d.toLocaleDateString())) / a.timesRev)) * 100)
      >
      (Math.exp(-(diffInDays(b.lastRev, getYYYYMMDD(d.toLocaleDateString())) / b.timesRev)) * 100)) ? 1
      : (((Math.exp(-(diffInDays(a.lastRev, getYYYYMMDD(d.toLocaleDateString())) / a.timesRev)) * 100)
        <
        (Math.exp(-(diffInDays(b.lastRev, getYYYYMMDD(d.toLocaleDateString())) / b.timesRev)) * 100)) ? -1 : 0))
      .map((el, ind) => {
        document.getElementById("card" + ind).style.background = "blue"
        // //console.log((Math.exp(-(
        // diffInDays(
        //   el.lastRev, getYYYYMMDD(d.toLocaleDateString())) / el.timesRev))))
        // //console.log(tmp, parseInt(targ), 100-(Math.exp(-(
        // diffInDays(
        //   el.lastRev, getYYYYMMDD(d.toLocaleDateString())) / el.timesRev))))
        tmp += (1 - (Math.exp(-(
          diffInDays(
            el.lastRev, getYYYYMMDD(d.toLocaleDateString())) / el.timesRev)))) / (state.syllabus.length)
        //console.log(tmp*300,targ)
        if (Math.round(tmp * 300) >= parseInt(targ) && find(state.syllabus, el) !== -1 && index === null) {
          //console.log(tmp*300, targ)
          //console.log(document.getElementById("card" + ind))
          localStorage.setItem("ind", ind)
          //console.log(ind)
          index = ind
          // document.getElementById("card" + ind).style.outlineWidth = "5px"
          // document.getElementById("card" + ind).style.marginBottom = "5px"
        }
      })
    return index
  }
  const setSyll = (syll) => {
    localStorage.setItem("syllabus", JSON.stringify(syll))
  }
  const set = (index) => {
    const arr = state.recordArr
    const syl = state.syllabus
    const sylInd = find(state.syllabus, arr[index])
    ////console.log(sylInd)
    syl[sylInd].timesRev = Number(syl[sylInd].timesRev) + 1
    syl[sylInd].lastRev = getYYYYMMDD(d.toLocaleDateString())
    arr[index].timesRev = Number(arr[index].timesRev) + 1
    arr[index].lastRev = getYYYYMMDD(d.toLocaleDateString())
    setstate({ ...state, recordArr: arr, syllabus: syl })
    //////console.log("here")
    //////console.log(state.recordArr)
    localStorage.setItem("records", JSON.stringify(state.recordArr))
    localStorage.setItem("syllabus", JSON.stringify(state.syllabus))
  }
  const expectedMarks = syllabus => {
    // //////console.log(syllabus)
    let sum = 0
    syllabus.map(item => {
      sum += (Math.exp(-(
        diffInDays(
          item.lastRev, getYYYYMMDD(d.toLocaleDateString())) / item.timesRev)))
    })
    return (sum / syllabus.length)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Forgetting Curve Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Expected Marks Acc To Syllabus = {expectedMarks(state.syllabus) * 300}</h1>
        <h1 style={{ "color": "red", "textAlign": "center" }}>You Forget Almost 70% Of What You Newly Learnt In Just One Day...!!</h1>
        <input type="text" id="search" value={state.search} placeholder="Search" onChange={() => setstate({
          ...state,
          search: event.target.value,
        })} />
        <input type="number" id="target" value={state.target} placeholder="Today's Target" onChange={() => {
          //console.log(target(event.target.value))
          setstate({
            ...state,
            target: event.target.value,
            ind: target(event.target.value)
          })
        }} />
        {//console.log(state.ind, "\n\n\n\n\n")}
          {
            state.open ? (
              <div className={styles.title}>
                <form>
                  <label htmlFor="topic">Enter the topic</label>
                  <input type="text" id="topic" value={state.text} onChange={() => setstate({
                    ...state,
                    text: event.target.value,
                  })} />
                  <label htmlFor="lastRev">Enter the Date Of Last Revision</label>
                  <input type="date" id="lastRev" value={state.lastRev} onChange={() => setstate({
                    ...state,
                    lastRev: event.target.value,
                  })} />
                  <label htmlFor="timesRevised">Enter the No of times you have revised this topic since the first time</label>
                  <input type="number" id="timesRevised" value={state.timesRev} onChange={() => setstate({
                    ...state,
                    timesRev: event.target.value,
                  })} />

                  <button className={styles.btn} onClick={() => {
                    //////console.log(state)
                    setstate({
                      ...state,
                      recordArr: [...state.recordArr, {
                        text: state.text,
                        lastRev: state.lastRev,
                        timesRev: state.timesRev
                      }],
                      open: false
                    })
                  }}>Add</button>
                  <button
                    className={styles.btn}
                    style={{ "backgroundColor": "red" }}
                    onClick={() => setstate({ ...state, open: false })}>
                    Cancel
                  </button>
                </form>
              </div>

            ) : (
              <>
                <button className={styles.btn} onClick={() => setstate({
                  ...state,
                  open: true,
                })}>Add</button>
                {state.recordArr.sort((a, b) => (
                  (Math.exp(-(diffInDays(a.lastRev, getYYYYMMDD(d.toLocaleDateString())) / a.timesRev)) * 100)
                  >
                  (Math.exp(-(diffInDays(b.lastRev, getYYYYMMDD(d.toLocaleDateString())) / b.timesRev)) * 100)) ? 1
                  : (((Math.exp(-(diffInDays(a.lastRev, getYYYYMMDD(d.toLocaleDateString())) / a.timesRev)) * 100)
                    <
                    (Math.exp(-(diffInDays(b.lastRev, getYYYYMMDD(d.toLocaleDateString())) / b.timesRev)) * 100)) ? -1 : 0))
                  .map((item, index) => {
                    // //////console.log(state.syllabus, find(state.syllabus,item), item)
                    if (state.search !== "" && item.text.toLowerCase().indexOf(state.search.toLowerCase()) > -1) {
                      return (
                        <Card ind={JSON.parse(localStorage.getItem("ind"))} index={index} id={"card" + index} inIt={find(state.syllabus, item) !== -1} title={item.text} onClick={(e) => {
                          if (find(state.syllabus, item) === -1) {
                            setSyll([...state.syllabus, item])
                            setstate({
                              ...state,
                              syllabus: [...state.syllabus, item]
                            })
                            document.getElementById("card" + index).style.backgroundColor = "blue"
                            document.getElementById("card" + index).style.color = "white"
                          } else {
                            let arr = [...state.syllabus]
                            let ind = find(arr, item)
                            arr.splice(ind, 1)
                            // //////console.log(arr)
                            setSyll([...arr])
                            setstate({ ...state, syllabus: [...arr] })
                            document.getElementById("card" + index).style.backgroundColor = "white"
                            document.getElementById("card" + index).style.color = "black"
                          }
                        }} retention={
                          (Math.exp(-(
                            diffInDays(
                              item.lastRev, getYYYYMMDD(d.toLocaleDateString())) / item.timesRev)) * 100).toString() + "%"
                        }
                          lastRev={item.lastRev} timesRev={item.timesRev} btn={styles.btn} key={index + "hahh"} addRev={() => set(index)}></Card>
                      )
                    } else if (state.search === "") {
                      return (
                        <Card ind={JSON.parse(localStorage.getItem("ind"))} index={index} id={"card" + index} inIt={find(state.syllabus, item) !== -1} title={item.text} onClick={(e) => {
                          if (find(state.syllabus, item) === -1) {
                            // //////console.log("hehhehehehehe")
                            setSyll([...state.syllabus, item])
                            setstate({
                              ...state,
                              syllabus: [...state.syllabus, item]
                            })
                            document.getElementById("card" + index).style.backgroundColor = "blue"
                            document.getElementById("card" + index).style.color = "white"
                          } else {
                            // //////console.log("hereeeee")
                            let arr = [...state.syllabus]
                            let ind = find(arr, item)
                            ////console.log(item)
                            ////console.log(ind)
                            arr.splice(ind, 1)
                            ////console.log(arr)
                            setSyll([...arr])
                            setstate({ ...state, syllabus: [...arr] })
                            document.getElementById("card" + index).style.backgroundColor = "white"
                            document.getElementById("card" + index).style.color = "black"
                          }
                        }} retention={
                          (Math.exp(-(
                            diffInDays(
                              item.lastRev, getYYYYMMDD(d.toLocaleDateString())) / item.timesRev)) * 100).toString() + "%"
                        }
                          lastRev={item.lastRev} timesRev={item.timesRev} btn={styles.btn} key={index + "hahh"} addRev={() => set(index)}></Card>
                      )
                    }
                  })}
              </>
            )
          }

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}
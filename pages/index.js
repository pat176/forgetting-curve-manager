import Head from 'next/head'
import { useEffect, useState } from 'react'
import Card from '../components/Card/Card'
import styles from '../styles/Home.module.css'
import moment from "moment"
const d = new Date();
const diffInDays = (date1, date2)=>{
  let a = moment(date1, 'YYYY/MM/DD');
  let b = moment(date2, 'YYYY/MM/DD');
  let diffDays = b.diff(a, 'days');
  // console.log(diffDays)
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
  });
  useEffect(() => {
    if (localStorage.getItem("records")) {

      diffInDays("2020/11/11", getYYYYMMDD(d.toLocaleDateString()))
      setstate({
        ...state,
        recordArr: JSON.parse(localStorage.getItem("records"))
      })
    } else  {
      // console.log("here")
      localStorage.setItem("records", JSON.stringify([]))
    }
  }, [])
  useEffect(() => {
    // console.log(state.recordArr)
    if (state.recordArr !== undefined){

      if (state.recordArr.length !== 0) {
        // console.log("object")
        localStorage.setItem("records", JSON.stringify(state.recordArr))
      }
    }
  }, [state.recordArr])
  const set= (index)=> {
    const arr = state.recordArr
    arr[index].timesRev=Number(arr[index].timesRev)+1
    arr[index].lastRev=getYYYYMMDD(d.toLocaleDateString())
    setstate({ ...state, recordArr: arr })
    // console.log("here")
    // console.log(state.recordArr)
    localStorage.setItem("records", JSON.stringify(state.recordArr))
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Forgetting Curve Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 style={{"color": "red","textAlign":"center"}}>You Forget Almost 70% Of What You Newly Learnt In Just One Day...!!</h1>
        <input type="text" id="search" value={state.search} placeholder="Search" onChange={() => setstate({
          ...state,
          search: event.target.value,
        })} />
        {state.open ? (
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
                // console.log(state)
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
                .map((item, index)=>{
                  if (state.search !== "" && item.text.toLowerCase().indexOf(state.search.toLowerCase()) > -1) {

                    return (
                      <Card title={item.text} retention={
                        (Math.exp(-(
                          diffInDays(
                            item.lastRev, getYYYYMMDD(d.toLocaleDateString()))/item.timesRev))*100).toString()+"%"
                          } 
                          lastRev={item.lastRev} timesRev={item.timesRev} btn={styles.btn} key={index+"hahh"} addRev={()=>set(index)}></Card>
                    )
                  } else if (state.search===""){
                    return (
                      <Card title={item.text} retention={
                        (Math.exp(-(
                          diffInDays(
                            item.lastRev, getYYYYMMDD(d.toLocaleDateString())) / item.timesRev)) * 100).toString() + "%"
                        }
                        lastRev={item.lastRev} timesRev={item.timesRev} btn={styles.btn} key={index + "hahh"} addRev={() => set(index)}></Card>
                    )
                  }
                })}
          </>
        )}

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
import React, { useState } from "react"
import "./App.css"
import * as XLSX from "xlsx"
import Moment from "moment"

function App() {
  const [items, setItems] = useState([])

  function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569)
    var utc_value = utc_days * 86400
    var date_info = new Date(utc_value * 1000)

    var fractional_day = serial - Math.floor(serial) + 0.0000001

    var total_seconds = Math.floor(86400 * fractional_day)

    var seconds = total_seconds % 60

    total_seconds -= seconds

    var hours = Math.floor(total_seconds / (60 * 60))
    var minutes = Math.floor(total_seconds / 60) % 60

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    )
  }

  const dataHora = (dt) => {
    const xpto = new Date(Math.round((dt - 25568) * 86400 * 1000))
    return Moment(xpto).format("DD/MM/YYYY")
  }

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = (e) => {
        const bufferArray = e.target.result

        const wb = XLSX.read(bufferArray, { type: "buffer" })

        const wsname = wb.SheetNames[0]

        const ws = wb.Sheets[wsname]

        const data = XLSX.utils.sheet_to_json(ws)

        resolve(data)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })

    promise.then((planilha) => {
      setItems(Object.values(planilha))
      // planilha.map((linha, i) => {
      //   if (i === 1) {
      //     Object.keys(linha).map((chave) => {
      //       // x.map((z) => {
      //       //   const { a, b } = z
      //       //   console.log(a)
      //       //   console.log(b)
      //       // })
      //       console.log("_CHAVE_")
      //       console.log(chave)
      //       console.log("_LINHA_")
      //       console.log(linha)
      //       console.log("_PLANILHA_")
      //       console.log(planilha)
      //       console.log("_LINHA(CHAVE)_")
      //       console.log(linha[chave])
      //     })
      //   }
      // })
    })
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0]
          readExcel(file)
        }}
      />

      <table className="table container">
        <thead>
          <tr>
            <th scope="col">A</th>
            <th scope="col">B</th>
            <th scope="col">C</th>
            <th scope="col">D</th>
            <th scope="col">E</th>
            <th scope="col">F</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d, index) => (
            <tr key={index}>
              <th>{dataHora(d.A)}</th>
              <th>{d.B}</th>
              <th>{d.C}</th>
              <th>{d.D}</th>
              <th>{d.E}</th>
              <th>{d.F}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App

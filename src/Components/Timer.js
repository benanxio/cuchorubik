import React, { useState, useEffect, useRef } from "react";
import CubeScrambleGenerator from "./CubeScrambleGenerator";
import './TimerStyles.css';
import { formatTime, formattedDateTime } from "./Herramientas";

import Swal from "sweetalert2";


function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [color, setColor] = useState('white');
  const [duration, setDuration] = useState(0);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const timeRef = useRef(0);
  const [scramble, setScramble] = useState("");
  const [timeObject, setTimeobject] = useState([]);
  const [avg, setAvg] = useState(0);
  const [listTimes, setListTimes] = useState([]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  },);


  useEffect(() => {

    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    else if (isKeyPressed) {

      intervalId = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 10);
      }, 10);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, isKeyPressed]);

  useEffect(() => {
    if (duration > 1000) {
      setColor('green');
    } else if (duration > 500) {
      setColor('red');
    } else {
      setColor('white');
    }
  }, [duration]);

  useEffect(() => {
    setScramble(CubeScrambleGenerator(20));
    const sessionTimes = window.sessionStorage.getItem("Times")
    if (sessionTimes != null) {
      setTimeobject(
        JSON.parse(sessionTimes)
      )
    }
  }, [])

  useEffect(() => {

    setAvg(timeObject.reduce((suma, val) => {

      return suma + val.Time;

    }, 0))

    window.sessionStorage.setItem("Times", JSON.stringify(timeObject));
  }, [timeObject])


  useEffect(() => {

    const DeleteItems = (indexItem) => {

      setTimeobject(timeObject.filter((prevTime, index) => index !== indexItem));

    };

    if (timeObject.length > 0) {
      const tiempos = timeObject.map((val) =>
        val.Time
      );

      const max = {
        'valor': Math.max(...tiempos),
        'props': {
          'color': 'rgb(238, 83, 80)',
          'fontWeight': 'bold'
        }
      };

      const min = {
        'valor': Math.min(...tiempos),
        'props': {
          'color': 'rgb(0,120,3)',
          'fontWeight': 'bold'
        }

      };

      setListTimes(timeObject.map((value, index) => {
        return (
          <tr key={index}>
            <th scope="row" className="Fila">{index}</th>
            <th className="Info Fila">{value.Fecha}</th>
            <td className="Fila">{value.Scramble}</td>
            <td className="Options Fila">

              <span style={
                value.Time === max.valor && timeObject.length > 1 ? (max.props) :
                  (value.Time === min.valor && timeObject.length > 1 ? (min.props) : ({}))}>
                {formatTime(value.Time)}
              </span>
              <i className='fa fa-trash' onClick={() => DeleteItems(index)}></i>
            </td>
          </tr>
        )
      }))

    }
    else {
      setListTimes([]);
    }

  }, [timeObject])

  const handleStart = () => {
    setIsRunning(true);
    setTime(0);
    timeRef.current = 0;
  };

  const deleteAll = () => {
    Swal.fire({
      title: '¿Estas seguro(a)?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(238, 83, 80)',
      cancelButtonColor: 'rgb(0,120,3)',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeobject([])

        Swal.fire(
          '¡Tiempos eliminados!',
          'Tus registros de tiempo fueron eliminados',
          'success'
        )
      }
    })
  }

  const handleStop = () => {

    setScramble(CubeScrambleGenerator(20));

    const currentDate = new Date();
    setIsRunning(false);

    setTimeobject(prevTime => [
      ...prevTime,
      {

        "Fecha": formattedDateTime(currentDate),
        "Scramble": scramble,
        "Time": time,

      },
    ])
  };

  const handleKeyDown = (event) => {
    if (event.code === "Space" || event.touches) {
      if (!event.touches) {
        event.preventDefault();
      }

      setIsKeyPressed(true);
    }

  };

  const handleKeyUp = (event) => {
    if (event.code === 'Space' || event.touches) {
      if (!event.touches) {
        event.preventDefault();
      }

      setIsKeyPressed(false);

      if (duration > 1000) {
        setDuration(0);
        isRunning ? (handleStop()) : (handleStart());
      }
      else if (isRunning) {
        handleStop()
      }
      else {
        setDuration(0);
      }
    }
  };

  const ocultar = (flex) => {
    return isRunning ? ({ display: 'none' }) : (flex ? ({ display: 'flex' }) : ({ display: 'block' }))
  }

  return (
    <>

      <div className={`Scramble ${isRunning ? "Maximize" : ""}`} onTouchStart={handleKeyDown} onTouchEnd={handleKeyUp}>
        <div className="TimerOptions" style={ocultar(true)}>
          <i className='fa fa-refresh' onClick={() => setScramble(CubeScrambleGenerator(20))}></i>
          <i className='fa fa-times' onClick={() => alert("Hola :')")}></i>
          <i className='fa fa-archive' onClick={() => alert("\u2764")}></i>
        </div>
        <div className="Gentimer">
          <div className="Timer">
            <h1 style={ocultar(false)}>{scramble}</h1>
            <h1 className="Time" style={{ color }}>{formatTime(time, true)}</h1>
            <h1 className="Average" style={ocultar()}>
              AVG: {timeObject.length > 0 ? formatTime(avg / timeObject.length, false) : "0s"}
            </h1>
          </div>
          <div style={ocultar(true)} className="cube">
            <scramble-display event="333" scramble={scramble}></scramble-display>
          </div>
        </div>
      </div>
      <div className="Tiempos" style={ocultar(false)}>
        <table className="table table-striped table-dark">
          <caption>{`Hay ${timeObject.length} registro${timeObject.length !== 1 ? "s " : " "}`}
            <i className='fa fa-trash' onClick={() => deleteAll()} />
            {" Eliminar todo"}
          </caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th className="Info" scope="col">Fecha</th>
              <th scope="col">Scramble</th>
              <th scope="col">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {listTimes}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Timer;

import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "./Header";
import GameOver from "./GameOver";
import GameCompleted from "./GameCompleted";
import variables from "../../../utils/variables";
import { Cells, Grid, Ids } from "../../app/types";
import { PlayerData, PuzzleData, Sudoku } from "../../app/dbTypes";
import GameSettins from "./GameSettings";
import VsRomm from "./VsRoom";
import { io, Socket } from "socket.io-client";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/hooks";

function VsGame () {
    const game_id:Ids = useParams().game_id as Ids
    const {register} = useForm()

    const [sudoku, setSudoku] = useState<Sudoku>()
    const [puzzle , setPuzzle] = useState<PuzzleData>()
    const [answers , setAnswers] = useState<Grid>()
    const [answersN , setAnswersN] = useState<string>()
    const [remaningNumbers , setRemainingNumbers] = useState(() => Array(9).fill(0))
    const [errores , setErrores] = useState(0)

    const [currentFocus , setCurrentFocus] = useState<string>()
    const [timeElapsed , setTimeElapsed] = useState(0)
    const [timerOn , setTimerOn] = useState(false)
    const [colorGuides , setColorGuides] = useState(true)
    const [numberGuides , setNumberGuides] = useState(true)
    const [openSettings , setOpenSettings] = useState(false)

    const role = useAppSelector((state:RootState) => state.role.value)
    const [players , setPlayers] = useState<PlayerData[]>([])
    const handlePlayers = useCallback ((data?: PlayerData , dataA?: PlayerData[]) => {
        if (data) { // When data is an object then it pushes the object to the previous array
            setPlayers(prevPlayers => [...prevPlayers , data])
        } else { //If data is an array its values subtitue the previous array
            setPlayers(() => dataA? [...dataA] : [])
        }
    } , [])
    const [inList , setInList] = useState<boolean>(false)
    const [socket , setSocket] = useState<Socket | null>(null)


    const cells:Cells = [];
    function defineCells (cells:Cells):void {
    // This function defines the cells of the sudoku grid, so we can use them later
    // The cells are defined as a string with the format 'xy' where x is the row and y is the column
        for (let i=0 ; i < 9 ; i++) {
          for (let j=0 ; j < 9 ; j++) {
            cells.push(`${i}${j}`);
          }
        };
    }
    defineCells(cells)

    function cellsBorders (cells:Cells):void {
      // This function adds the borders to the cells, so we can see the sudoku grid
      for (let cell of cells) {
        if (parseInt(cell[1]) == 2 || parseInt(cell[1]) == 5) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-right')
        }
        if (parseInt(cell[1]) == 3 || parseInt(cell[1]) == 6) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-left')
        }
        if (parseInt(cell[0]) == 2 || parseInt(cell[0]) == 5) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-bottom')
        }
        if (parseInt(cell[0]) == 3 || parseInt(cell[0]) == 6) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-top')
        }
      }
    }

    // In game functions

    async function getPlayers () {
        try {
            if (players.length === 0) {
                const URL = variables.url_prefix + `/api/v1/players/${game_id}`
                const res = await axios.get(URL)
                // console.log(res)
                handlePlayers(undefined , res.data)
            } else {
                // console.log(players)
                const URL = variables.url_prefix + `/api/v1/players/in_list/${game_id}`
                const res = await axios.get(URL)
                // console.log(res)
                if (res.status === 200) {
                    setInList(true)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    function checkRemainingNumbers () {
        // This function checks how many numbers are remaining in the sudoku grid, so we can show them to the user
      let aux:number[] = Array(9).fill(0)
      for (let i=1 ; i < 10 ; i++) {
        for (let number of Array.from(answersN || [])) {
          if (parseInt(number) == i) {
            aux[i-1] += 1
          }

        }
      }
      // console.log(aux)
      setRemainingNumbers(aux)
    }
    
    function saveAnswers (grid:Grid | undefined , errores:number) {
      // This function also saves the game
      const URL = variables.url_prefix + `/api/v1/games/${game_id}`
      axios.patch(URL , {grid, time: timeElapsed , errors: errores})
        .then(res => {
          setAnswers(res.data.grid)
          setAnswersN(res.data.number)
          console.log('game saved')
          CompletedCheck(res.data.number)
        })
        .catch(err => {
          console.error(err)
        })  
    }

    function numberButton (currentFocused:string | undefined , value:number) {
      // console.log(currentFocused, value)
      if (currentFocused && value && timerOn) {
        const cell = document.getElementById(currentFocused) as HTMLInputElement
        if (answers && answers[parseInt(currentFocused[0])][parseInt(currentFocused[1])] !== sudoku?.grid[parseInt(currentFocused[0])][parseInt(currentFocused[1])]) {
          setValue(cell , value)
          verifyNumber(cell , currentFocused , value)
        }
      }
    }
    
    function verifyNumber (cell:HTMLInputElement , c:string , value:number) {
      let answersGrid = answers
      let aRow:Grid[0] | [] = answers ? answers[parseInt(c[0])] : [0 ,0 , 0, 0, 0, 0, 0, 0, 0]
      let err = errores
      // We need to compare the provided value with the correct value, then, let the user know if he is correct or not
      if (value === sudoku?.grid[parseInt(c[0])][parseInt(c[1])]) {
        cell.classList.remove('incorrect')
        cell.classList.add('correct')
        cell.disabled = true
      } else {
        if (value != 10) {
          err++
          setErrores(err)
          gameOverCheck(err)
        }
        cell.classList.remove('correct')
        cell.classList.add('incorrect')
      }
     
      // We also save the game via patch call
      if (value != 10) {
        aRow.splice(parseInt(c[1]) , 1 , value)
        answersGrid?.splice(parseInt(c[0]) , 1 , aRow)
      } else {
        aRow.splice(parseInt(c[1]) , 1 , 0)
        answersGrid?.splice(parseInt(c[0]) , 1 , aRow)
      }
      // console.log(answersGrid)
      saveAnswers(answersGrid , err)
    }

    function setValue (cell:HTMLInputElement, value:number) {
      if (value != 10) {
        cell.value = value.toString()
        cell.focus()
      } else {
        cell.value = ''
        cell.focus()
      }
    }

    // Focus actions
    function selectRowNColumn (id:string) {
      for (let cell of cells) {
        if (id != 'x') {
          if (cell[0] === id[0] || cell[1] === id[1] || (Math.ceil((parseInt(cell[0])+1)/3) === Math.ceil((parseInt(id[0])+1)/3) && Math.ceil((parseInt(cell[1])+1)/3) === Math.ceil((parseInt(id[1])+1)/3))) {
            const div = document.getElementById(`c${cell}`) as HTMLDivElement
            div.classList.add('selected')
          } else {
            const div = document.getElementById(`c${cell}`) as HTMLDivElement
            div.classList.remove('selected')
          }
        } else {
          const div = document.getElementById(`c${cell}`) as HTMLDivElement
          div.classList.remove('selected')
        }
      }
    }

    function sameNumbers(id:string) {
      // Highlight all numbers that are the same as the selected one
      let number = document.getElementById(id)?.innerText
      if (!number || id == 'x') {
        number = '10'
      }
      for (let cell of cells) {
        const number2 = document.getElementById(cell)?.innerText
        if (number == number2) {
          const div = document.getElementById(`c${cell}`) as HTMLDivElement
          div.classList.add('font-bold')
        } else {
          const div = document.getElementById(`c${cell}`) as HTMLDivElement
          div.classList.remove('font-bold')
        }
      }
    }

    const handleFocus = useCallback((id:string) => { 
      focusOperations(id)
    } , [focusOperations])

    function focusOperations(id:string) {
      if (colorGuides) {
        selectRowNColumn(id)
      }
      if (numberGuides) {
        sameNumbers(id)
      }
      setCurrentFocus(id)
    }

    function clearColorGuides () {
      cells.forEach(cell => {
        const div = document.getElementById(`c${cell}`) as HTMLDivElement
        div.classList.remove('selected')
      })
    }

    function clearNumberGuides () {
      cells.forEach(cell => {
        const div = document.getElementById(`c${cell}`) as HTMLDivElement
        div.classList.remove('font-bold')
      })
    }

    // After game functions
    function gameOverCheck(e:number) {
      if (e >= 3) {
        setTimerOn(false)
      }
    }

    function CompletedCheck(number:string) {
      if (sudoku?.number == number) {
        setTimerOn(false)
      }
    }

    // Socket functions

    useEffect(() => {
      if (!answers) {
        try {
          const URL = variables.url_prefix + `/api/v1/games_vs/${game_id}`
          axios.get(URL)
            .then(res => {
            //   console.log(res)
              setAnswers(res.data.grid)
              setAnswersN(res.data.number)
              setSudoku(res.data.Sudoku)
            //   console.log(res.data.Sudoku)
              setPuzzle(res.data.Puzzle)
              setTimeElapsed(res.data.time)
              setErrores(res.data.errors)
            })
            .catch(err => {
              console.error(err)
            })
            
          } catch (error) {
            console.error(error)
          }    
        }
      }, []);

    useEffect (
      () => {
          getPlayers()
        }, [players , inList]
    )
        
    useEffect(
      () => {
        if (answers) {
          cellsBorders(cells)
          checkRemainingNumbers();
        }
      } , [answers]
    )

    useEffect(
      () => {
        if (currentFocus) {
          focusOperations(currentFocus)
        }
      }, [currentFocus , answers]
    )

    useEffect(() => {
      if (timerOn) {
        const timer = setInterval(() => {
          setTimeElapsed((time) => time + 1);
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup on unmount or when `timerOn` changes
      }
    }, [timerOn]);

    useEffect(
        () => {
            const newSocket = io(variables.socket_url , {
                transports: ['websocket']
            })
            setSocket(newSocket)

            newSocket.on('connect_error' , (err) => {
                console.error('Socket error: ', err)
            })

            newSocket.emit('join-room' , players)

            newSocket.on('message' , (data) => console.log(data))

            newSocket.on('updated-players' , data => {
                console.log('new players:' , data)
                handlePlayers(undefined , data)
            })

            return () => {newSocket.disconnect()}
        } , [role]
    )

    if (answers) {
        return (
          <div className="grid-container"> 
            <Header errores={errores} time={timeElapsed} pause={() => {setTimerOn(false);setOpenSettings(true)}} play={() => {setTimerOn(true);setOpenSettings(false)}} timerOn={timerOn} save={() => saveAnswers(answers , errores)}/>  
            <div className="grid">
            {cells.map((cell, index) => {
                return (
                <div id={`c${cell}`} onClick={() => handleFocus(cell)} className="cell" key={index}>
                    {answers[parseInt(cell[0])][parseInt(cell[1])] == sudoku?.grid[parseInt(cell[0])][parseInt(cell[1])]?
                        <p id={cell}>{answers[parseInt(cell[0])][parseInt(cell[1])]}</p>
                    : 
                        <input id={cell} type="text" autoComplete="off" readOnly={true} maxLength={1}
                        disabled={!timerOn} 
                        defaultValue={answers[parseInt(cell[0])][parseInt(cell[1])] != 0 ? answers[parseInt(cell[0])][parseInt(cell[1])] : ''} 
                        className={answers[parseInt(cell[0])][parseInt(cell[1])] == sudoku?.grid[parseInt(cell[0])][parseInt(cell[1])] ? 'correct' : 'incorrect'}
                        {...register(`${cell}`)}/>
                    }
                </div>
                )
            })}
            </div>
            <div className="remaining-numbers">
              <h2>Números restantes:</h2>
              {remaningNumbers.map((n , index) => 
                <button onClick={() => numberButton(currentFocus , index+1)} className="remaining-number" key={index}>{n<9?index +1:''}</button>
              )}
              <button onClick={() => numberButton(currentFocus , 10)}>
                <i className="fa-solid fa-eraser fa-xl"></i>
              </button>
            </div>
            <div id="x" onClick={() => focusOperations('x')} className="grid-auxiliar"></div>
            {openSettings?
              <GameSettins rcMatch={colorGuides} nMatch={numberGuides} setRcMatch={setColorGuides} setNMatch={setNumberGuides} clearColorGuides={clearColorGuides} clearNumberGuides={clearNumberGuides} selectRowNColumn={() => { if (currentFocus)selectRowNColumn(currentFocus)}} sameNumbers={() => {if (currentFocus) sameNumbers(currentFocus)}}/>
                :
              <></>}
            {errores >= 3?
              <GameOver game_id={game_id} puzzle={puzzle} setAnswers={setAnswers} setAnswersN={setAnswersN}/>
              :
              <></>
            }
            {sudoku?.number == answersN?
              <GameCompleted game_id={game_id} time={timeElapsed}/>
              :
              <></>
            }
            <VsRomm game_id={game_id} players={players} handlePlayers={handlePlayers} inList={inList} setInList={setInList} role={role} getPlayers={getPlayers}/>
          </div>
        )
    }
  }

export default VsGame
import React,{useState,useRef, useEffect} from 'react'
import PlayerCard  from '../components/PlayerCard'

const GameBoard = ()=>{
    const [userTypedChar,setUserTypedChar]=useState('');
    const [time,setTime]=useState(100);
    const [wpm,setWpm]=useState(0);
    const [accuracy,setAccuracy]=useState(100);
    const [wordNumber,setWordNumber]=useState(0)
    const [errorCount,setErrorCount]=useState(0);
    const disableInputBox = useRef(false);
    const intervalRef = useRef(null)
    const gameStatusRef = useRef("not_started")
    const [snippet,setSnippet]= useState(["apple", "banana", "cherry", "date", "grape"])


    useEffect(()=>{
        if(gameStatusRef.current == "started"){
            intervalRef.current = setInterval(()=>{
                setTime(prev=>{
                    let dummy = prev -1;
                    if(dummy==0 || gameStatusRef.current=="ended"){
                        clearInterval(intervalRef.current)
                        intervalRef.current = null
                        disableInputBox.current = true
                    }
                    return dummy;
                });
            },1000)
        }
        if(gameStatusRef.current=="ended"){
            setTime(prev=>{
                // total give second 100s from 100 it goes 99,98...2,1,0
                let dummy = 100-prev;
                if(dummy>=60){
                    return `01:${dummy % 60}`
                }else{
                    return `00:${dummy}`
                }
            })
        }
        return ()=> clearInterval(intervalRef.current)
    },[gameStatusRef.current])

    const handleTheGameLogic = (e)=>{

        const heTypeCorrectOrNot = (word,userTypedChar)=>{
            let flag =0;
            for(let i=0;i<word.length;i++){
                userTypedChar[i]==word[i]?flag++:flag--;
                }
            return flag==word.length;
         }

         const totalCharacterTyped = (wordTyped)=>{
            let totalChar = 0;
            for(let i=0;i<wordTyped;i++){
                totalChar+=snippet[i].length
            } 
            if(errorCount!==0){
                let calculateAccuracy = Math.floor(((totalChar-errorCount)/totalChar)*100)
                setAccuracy(calculateAccuracy)
            }
         }

        let word =  document.querySelector(`[data-wordid="${wordNumber}"]`).textContent;

        if(e.key == " " || e.key=="Enter"){

            gameStatusRef.current = "started"

            if(heTypeCorrectOrNot(word,userTypedChar)){
                setWpm(prev=>{
                    let dummy = prev +1;
                    totalCharacterTyped(dummy);
                    return dummy;
                });
                setWordNumber(prev=>{
                    let dummy = prev+1;
                    if(dummy==snippet.length){
                        disableInputBox.current = true;
                        gameStatusRef.current = "ended"
                    }
                    return dummy;
                });
                setUserTypedChar('')
                return;
            }
            setUserTypedChar(userTypedChar.trim())

        }else{
            for(let i=0;i<word.length;i++){
                if(userTypedChar[i]==word[i]){
                  document.querySelector(`[data-characterid="${wordNumber+String(i)}"]`).classList.add("green")
                }else{
                    document.querySelector(`[data-characterid="${wordNumber+String(i)}"]`).classList.remove("green")
                }
            }
            if(e.key=="Backspace"){
                setErrorCount(prev=>prev+1);
            }
        }  
    }
    return(
    <div className='flex justify-center items-center'>
        <PlayerCard error={errorCount} wpm={wpm} time={time} accuracy={accuracy} />
        <div className='flex flex-col m-6'>
            <div className='flex flex-col border w-[450px] rounded-lg border-black'>
                <div className='flex justify-between border-b border-black p-4'>
                    <h1>snippet</h1>
                    <div>
                        <span>you are</span>
                        <span></span>
                    </div>
                </div>
                <div className='m-4 p-2 rounded-md text-lg border border-black'>
                    {
                        snippet.map((word,i)=>{
                            return (
                                <div key={i} data-wordid={i} className='pr-1 inline-block'>
                                    {
                                        Array.from(word).map((character,j)=>{
                                            return (
                                                <span key={j} data-characterid={i+String(j)}>{character}</span>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>  
            <div className='mt-6 border border-black rounded-lg w-[450px]'>
                <input 
                type="text" 
                value={userTypedChar}
                onChange={(e)=>setUserTypedChar(e.target.value)}
                onKeyUp={handleTheGameLogic}
                disabled={disableInputBox.current}
                placeholder={wordNumber==0?'press enter to start the game!':''}
                className='border-b border-black block my-4 mx-auto text-lg w-2/3 text-center outline-none'
                />
            </div>  
        </div>
    </div>)
       
}

export default GameBoard;
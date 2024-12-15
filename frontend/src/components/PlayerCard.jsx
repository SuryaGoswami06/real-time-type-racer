import React, { useEffect ,useState} from 'react'
import axios from 'axios'
const PlayerCard =React.memo(({
    error =0,
    accuracy=100,
    wpm=0,
    time=0,
    userName="you"
})=>{
    const [userProfile,setUserProfile]=useState('')
    useEffect(()=>{
        axios.get(`https://api.multiavatar.com/Binx Bond.png`,{
            responseType:'arraybuffer'
        })
        .then((response)=>{
            const blob = new Blob([response.data],{type:'image/png'})
            const imageUrl = URL.createObjectURL(blob)
            setUserProfile(imageUrl)
        })
        .catch((err)=>console.log(err))
        
    },[])
    return ( 
        <div className=' grid grid-cols-3 gap-x-2 gap-y-2 grid-rows-2 shadow-lg rounded-lg border border-black p-2'>
            <div className='col-span-1 row-span-1 flex flex-col items-center'>
                <span>Errors</span>
                <span>{error}</span>
            </div>
            <div className='col-span-1 row-span-1 flex flex-col items-center'>
                <span>accuracy</span>
                <span>{accuracy}%</span>
            </div>
            <div className='col-span-1 row-span-1 flex flex-col items-center'>
                <span>time(s)</span>
                <span>{time}</span>
            </div>
            <div className=' bg-black rounded-lg text-white col-span-3 row-span-1 flex justify-between items-center p-2'>
                <div>
                    <img className='inline-block h-8 w-8 rounded-full' src={userProfile} alt="user-avatar" />
                    <span className='pl-2'>{userName}</span>
                </div>
                <div className='flex'>
                    <span className='mr-1'>{wpm}</span>
                    <span>wpm</span>
                    <span className='bg-green-500 block ml-1 text-center w-8 h-8 rounded-full'>-</span>
                </div>
            </div>
        </div>
    )
})

export default PlayerCard
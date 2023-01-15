import axios from 'axios';
import { useRef } from 'react';
import React, { useState } from 'react'

const img = () => {
    const inputRef = useRef(null)
    const [file, setFile] = useState()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!file) return
        console.log(file)

        //upload to web3
        await axios.post('http:/localhost:8080/api/saveImageToWeb3')
    }
  return (
    <div>
        <form name="userform">
            <input ref={inputRef} type="file" name="userimage" onChange={e => setFile(e.target.files[0])}/>
            <button className="bg-slate-300 p-3" onClick={handleSubmit}>Upload </button>
        </form>
    </div>
  )
}

export default img
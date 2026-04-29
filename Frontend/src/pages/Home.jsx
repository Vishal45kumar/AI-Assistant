import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { BiMenuAltRight } from "react-icons/bi"
import { RxCross1 } from "react-icons/rx"


const Home = () => {
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate();
  const [listening,setListening] = useState(false)
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis
  const [ham,setHam] = useState(false)
  const [userText,setUserText] = useState("")
  const [aiText,setAiText] = useState("")

  const handleLogOut =  async() => {
    try{
      const result = await axios.get(`${serverUrl}/api/auth/logout`,
        {withCredentials:true}
      )
      setUserData(null)
      navigate("/signin")
    }catch(error){
      console.log(error)
    }
  }

  const startRecognition = () =>{
   if(!isSpeakingRef.current && !isRecognizingRef.current)
    { try{
      recognitionRef.current?.start();
      //setListening(true)
    }catch(error){
      if(!error.message.includes("start")){
        console.error("Recognition error:",error);
      }
    }}
  }

  //to make ai assistant speak
  const speak = (text)=>{
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if(hindiVoice){
      utterence.voice = hindiVoice;
    }
    
    isSpeakingRef.current=true
    utterence.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false
      startRecognition()
    }
    synth.cancel()
    synth.speak(utterence)
  }

  const handleCommand=(data)=>{
    const {type,userInput,response} = data
    speak(response);

    if(type === 'google_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "whatsapp_open") {
      window.open(`https://www.whatsapp.com/`, "_blank");
    }

    if (type === "weather_show") {
      window.open(
        `https://www.google.com/search?q=weather&rlz=1C1IMSH_en-GBIN1081IN1082&oq=weather&gs_lcrp=EgZjaHJvbWUyDggAEEUYJxg5GIAEGIoFMgwIARAjGCcYgAQYigUyCggCEAAYkgMYgAQyDQgDEAAYgwEYsQMYgAQyDQgEEAAYgwEYsQMYgAQyDQgFEAAYgwEYsQMYgAQyBwgGEAAYgAQyBwgHEC4YgAQyBwgIEAAYjwIyBwgJEAAYjwLSAQkzNDU0ajBqMTWoAgiwAgHxBUWpArumQLo4&sourceid=chrome&ie=UTF-8`,
        "_blank",
      );
    }

    if (type === "youtube_search" || type==="youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    }    
  }
  //webspeech api to listen what we speak and convert it to text
  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true,//to continuosly open mike
    recognition.lang = 'en-US'//to print matter in english language
    recognitionRef.current=recognition

    const safeRecognition=()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        try{
          recognition.start();
          console.log("Recognition requested to start:")
        }catch(error){
          if(error.name !== "InvalidStateError"){
            console.error("Start error:",error)
          }
        }
      }
    }

    recognition.onstart=()=>{
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true)
    }

     recognition.onend = () => {
       console.log("Recognition stopped");
       isRecognizingRef.current = false
       setListening(false);
     };

     if(!isSpeakingRef.current){
      setTimeout(()=>{
        safeRecognition()
      },1000)
     }

     recognition.onerror = (e) => {
       console.warn("Recognition error:", e.error);
       isRecognizingRef.current=false;
       setListening(false);
       if(e.error !== "aborted" && !isSpeakingRef.current){
        setTimeout(()=>{
          safeRecognition();
        },1000)
       }
     };
    
     recognition.onresult = async (e) => {
       const transcript = e.results[e.results.length - 1][0].transcript.trim();
       setUserText(transcript)
       setAiText("")
       console.log("heard:" + transcript);
       if (
         transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
       ) {
         const data = await getGeminiResponse(transcript);
         recognition.stop()
         isRecognizingRef.current=false
         setListening(false)
         console.log(data);
         handleCommand(data);
         setUserText("")
         setAiText(data.response)
       }
     };
     const fallback=setInterval(()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        safeRecognition()
      }
     },10000)
     safeRecognition()
     return ()=>{
      recognition.stop()
      setListening(false)
      isRecognizingRef.current=false
      clearInterval(fallback)
     }
  },[userData])

  return (
  <div className="w-full min-h-screen bg-linear-to-t from-black to-[#030353] flex flex-col items-center justify-center px-4 py-6 relative">

    {/* 🔹 Top Bar */}
    <div className="w-full flex justify-between items-center absolute top-4 px-4">
      
      {/* Mobile Menu Button */}
      <button
        className="text-white text-3xl lg:hidden"
        onClick={() => setHam(!ham)}
      >
        {ham ? <RxCross1 /> : <BiMenuAltRight />}
      </button>

      {/* Desktop Buttons */}
      <div className="hidden lg:flex gap-3">
        <button
          className="px-4 py-2 bg-green-600 rounded-full text-white font-semibold"
          onClick={handleLogOut}
        >
          Logout
        </button>
        <button
          className="px-4 py-2 bg-green-600 rounded-full text-white font-semibold"
          onClick={() => navigate("/customize")}
        >
          Customize
        </button>
      </div>
    </div>

    {/* 🔹 Mobile Menu */}
    {ham && (
      <div className="absolute top-16 left-0 w-full bg-black/90 flex flex-col items-center gap-4 py-6 lg:hidden z-50">
        <button
          className="px-6 py-2 bg-green-600 rounded-full text-white font-semibold"
          onClick={handleLogOut}
        >
          Logout
        </button>
        <button
          className="px-6 py-2 bg-green-600 rounded-full text-white font-semibold"
          onClick={() => navigate("/customize")}
        >
          Customize
        </button>
      </div>
    )}

    {/* 🔹 Assistant Image */}
    <div className="w-full max-w-[320px] sm:max-w-100 md:max-w-112.5 h-auto aspect-4/5 flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">
      <img
        src={userData?.assistantImage}
        className="w-full h-full object-cover"
        alt="assistant"
      />
    </div>

    {/* 🔹 Name */}
    <h1 className="text-white text-lg sm:text-xl font-semibold mt-4">
      I'm {userData?.assistantName}
    </h1>

    {/* 🔹 Avatar */}
    {!aiText && (
      <img src={userImg} className="w-32 sm:w-40 mt-4" />
    )}
    {aiText && (
      <img src={aiImg} className="w-32 sm:w-40 mt-4" />
    )}

    {/* 🔹 Text Output */}
    <h1 className="text-white text-sm sm:text-lg font-semibold text-center mt-4 px-2 wrap-break-word">
      {userText ? userText : aiText ? aiText : null}
    </h1>
  </div>
);
}
export default Home
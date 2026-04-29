import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const {userData,setUserData,backendImage,selectedImage,serverUrl} = useContext(userDataContext)
    const [assistantName,setassistantName] = useState(userData?.assistantName || "")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const handleUpdateAssistant = async ()=>{
      setLoading(true)
      try{
        let formData = new FormData();
        formData.append("assistantName",assistantName)
        if(backendImage){
          formData.append("assistantImage",backendImage)
        }else{
          formData.append("imageUrl",selectedImage)
        }
        const result = await axios.put(`${serverUrl}/api/user/update`,formData,
          {withCredentials:true}
        )
        setLoading(false)
        console.log(result.data)
        setUserData(result.data)
      }catch(error){
        setLoading(false)
        console.log("error occured while uploading image",error)
      }
    }
  return (
    <div
      className="w-full min-h-screen bg-linear-to-t from-[black] to-[#030353]
    flex justify-center items-center flex-col relative"
    >
      <IoMdArrowRoundBack className='absolute top-7.5 left-7.5 text-white w-7 h-7 cursor-pointer' 
      onClick={() =>navigate("/customize")}/>
      <h1 className=" mb-7.5 text-white text-[30px] text-center">
        <span className="text-blue-200">Enter your Assistant name</span>
      </h1>
      <input
        type="text"
        placeholder="eg: Shifra"
        className="w-full max-w-150 h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 
        px-5 py-2.5 rounded-full text-[18px]"
        required
        onChange={(e) => setassistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="min-w-50 h-15 mt-7.5 text-white font-semibold bg-green-600 rounded-full text-[19px] cursor-pointer"
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant()
            navigate("/")
          }
          }
        >
          {!loading? "Create Assistant" : "loading...."}
        </button>
      )}
    </div>
  );
}

export default Customize2
import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext.jsx'

const Card = ({image}) => {
  const {
        serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
      } = useContext(userDataContext)
  return (
    <div className={`w-18 h-39
    lg:w-50 lg:h-70 bg-[#030326] border-2
    border-[#00ff15] overflow-hidden rounded-2xl hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
    hover:border-white hover:border-4 ${selectedImage == image?"border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={() => {setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null) }
    }>
        <img src={image} className='h-full object-cover' />
    </div>
  )
}

export default Card
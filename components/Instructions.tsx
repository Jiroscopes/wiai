import { useEffect } from "react"
import Image from 'next/image'

// My Stuff
import ExpandIcon from '../public/expand-icon.svg';
import CloseIcon from '../public/close-icon.svg';

type InstructionsProps = {
  showInstructions: boolean,
  setShowInstructions: Function
}
export default function Instructions({showInstructions, setShowInstructions}: InstructionsProps) {
  
  useEffect(() => {

  }, [showInstructions]);

  function closeModal() {
    setShowInstructions(false);
  }

  return (
    <>
      <div className="instructions-container flex-col items-center p-6 w-full md:w-auto rounded-md">
        <Image onClick={closeModal} className="cursor-pointer self-end" src={CloseIcon} width="30" height="30" alt="close button"/>
        <div className="text-yellow text-center text-3xl mb-4">
          <h2>How to play</h2>
        </div>
        <div className="flex flex-col text-white w-auto items-center text-center">
          <p>You will be shown 4 images. 
            <br />Try to find which of the images is Ai generated.</p>
        </div>
        <h3 className="text-yellow text-center mb-4 pt-8 text-xl">Some Tips:</h3>
        <ul className="instructions-list text-white w-3/5 list-disc flex items-center flex-col text-center">
          <li className="">Zoom in using the 			
            <div className='img-expand-instructions mx-2 inline-flex'>
				      <Image className='fill-darkestBlue' src={ExpandIcon} width='15' height='15' alt='expand image'/>
			      </div>
            Icon
          </li>
          <li>Look close at details in the image. At first glance an image can appear fine.</li>
          <li>Look at hands.</li>
        </ul>
      </div>
    </>
  )
}
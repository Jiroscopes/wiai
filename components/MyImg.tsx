import Image from 'next/image'
import React, {forwardRef, useState, useEffect} from 'react';

import ExpandIcon from '../public/expand-icon.svg';
interface ImgProps {
	url: string,
	alt: string,
	filename: string,
	selectedImg: string,
	selectImg?: Function,
	imgContainerClass: string,
	reff: any,
	open: any
}

export default function MyImg({url, alt, filename, selectedImg, selectImg, imgContainerClass, reff, open}: ImgProps) {
	const [selectedClass, setSelectedClass] = useState('');
	// Have to do this because of pre-rendering https://nextjs.org/docs/messages/react-hydration-error
	useEffect(() => {
		if (selectedImg === filename) {
			setSelectedClass('img-selected')
		}
	}, []);

	function selectThisImg() {
		if (typeof selectImg === 'function') {
			selectImg(filename);
		}
	}

	return <>
		<div className={`img-container relative ${selectedClass} ${imgContainerClass} ${((typeof selectImg === 'function') && (selectedImg  === filename)) ? 'img-selected' : ''}`}>
			{/* TODO: dynamic height & width*/}
			<div onClick={open} className='img-expand'>
				<Image className='fill-darkestBlue' src={ExpandIcon} width='15' height='15' alt='expand image'/>
			</div>
			<Image onClick={selectThisImg} ref={reff} className='object-cover h-full w-full' src={url} alt={alt} width="700" height="700" />
		</div>
	</>
}
import Image from 'next/image'

import ExpandIcon from '../public/expand-icon.svg';
interface ImgProps {
	url: string,
	alt: string,
	filename: string,
	selectedImg: string,
	selectImg: Function,
	imgContainerClass: string,
	reff: any,
	open: any
}

export default function MyImg({url, alt, filename, selectedImg, selectImg, imgContainerClass, reff, open, ...props}: ImgProps) {

	function selectThisImg() {
		selectImg(filename);
	}

	return <>
		<div className={`img-container relative ${selectedImg === filename ? 'img-selected' : ''} ${imgContainerClass}`}>
			{/* TODO: dynamic height & width*/}
			<div onClick={open} className='img-expand'>
				<Image className='fill-darkestBlue' src={ExpandIcon} width='15' height='15' alt='expand image'/>
			</div>
			<Image onClick={selectThisImg} ref={reff} className='object-cover h-full w-full' src={url} alt={alt} width="700" height="700" />
		</div>
	</>
}
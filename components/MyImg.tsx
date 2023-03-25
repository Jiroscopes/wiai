import Image from 'next/image'

interface ImgProps {
	url: string,
	alt: string
}

export default function MyImg({url, alt, ...props}: ImgProps) {
	return <>
		<div className='img-container'>
			<img src={url} alt={alt} />
		</div>
	</>
}
import React,{ useState,useLayoutEffect,RefObject } from 'react';



type dimensions = [number,number];

/**
 * Measure an element in the browser ui
 * @param element Element to measure
 * @return width, height, layout style ("large", "narrow", or "short")
 */
const useElementDimensions = (element:RefObject<HTMLElement>):dimensions => {
	const [ dimensions,setDimensions ] = useState<dimensions>([0,0])

	const handleResize = () => {
		if(!element.current) return;
		const { clientWidth,clientHeight } = element.current;
		const dimensions:dimensions = [ clientWidth,clientHeight ];
		setDimensions(dimensions);
	};

	useLayoutEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize)
		return () => { window.removeEventListener("resize", handleResize) }
	},[element])
  
	return dimensions;
};



export default useElementDimensions;

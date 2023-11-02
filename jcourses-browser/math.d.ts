declare namespace JSX {
	interface IntrinsicElements {
		"math" : React.DetailedHTMLProps<MathElementAttributes, HTMLElement>;

		"merror" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mfrac" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mi" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mmultiscripts" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mn" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mo" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mover" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mpadded" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mphantom" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mroot" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mrow" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"ms" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mspace" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"msqrt" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mstyle" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"msub" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"msubsup" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"msup" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mtable" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mtd" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mtext" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"mtr" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"munder" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
		"munderover" : React.DetailedHTMLProps<GlobalMathElementAttributes, HTMLElement>;
	}
}

interface GlobalMathElementAttributes extends React.HTMLAttributes<HTMLElement> {
	displaystyle? : boolean;
	style? : any;
}

interface MathElementAttributes extends GlobalMathElementAttributes {
	display? : string;
}




/*


mathbackground? :
A background-color for the element.

mathcolor? :
A color for the element.

mathsize? :
A <length-percentage> used as a font-size for the element.

mathvariant? :
A logical classes of token elements.

scriptlevel? :
Specifies a math-depth for the element. See the scriptlevel page for accepted values and mapping.

tabindex? :
*/
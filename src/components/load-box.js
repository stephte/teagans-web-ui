import "./load-box.scss";
import Load0 from '../images/turtle.gif';
import Load1 from '../images/deer.gif';
import Load2 from '../images/duck.gif';
import Load3 from '../images/peedog.gif';
import Load4 from '../images/rundog.gif';
import Load5 from '../images/money.gif';
// save money.gif for when payments happen :)

const loadgifs = [
  Load0,
  Load1,
  Load2,
  Load3,
  Load4
  // Load5
];

const LoadBox = ({ isLoading }) => {
	if (isLoading) {
		let gif = loadgifs[Math.floor(Math.random()*loadgifs.length)];
		return <img className='load-box' alt='Loading...' src={gif}/>;
	}
	return null;
}

export default LoadBox;
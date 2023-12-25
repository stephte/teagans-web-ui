import { Link } from "react-router-dom";
import "./form-box.scss";

const FormBox = ({ errMsg, subLinks, children }) => {
	return (
		<form-box>
			<p className="error">{errMsg || <span>&nbsp;</span>}</p>
			<div className="container">
				<div className="form-wrapper">
					{children}
				</div>
			</div>
			{subLinks && subLinks.length &&
				subLinks.map(({to, text}) => {
					return <p className="sublink"><Link to={to}>{text}</Link></p>;
				})
			}
		</form-box>
	);
};

export default FormBox;
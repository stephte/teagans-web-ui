import { Link } from "react-router-dom";
import LoadBox from "./load-box";
import "./form-box.scss";

const FormBox = ({ errMsg, subLinks, children, isLoading }) => {
	return (
		<form-box>
			<p className="error">{errMsg || <span>&nbsp;</span>}</p>
			<div className="container">
				<div className={`form-wrapper ${isLoading && "loading"}`}>
					<LoadBox isLoading={isLoading} />
					{children}
				</div>
			</div>
			{subLinks && subLinks.length &&
				subLinks.map(({to, text}) => {
					return <p className="sublink" key={to+text}><Link to={to}>{text}</Link></p>;
				})
			}
		</form-box>
	);
};

export default FormBox;
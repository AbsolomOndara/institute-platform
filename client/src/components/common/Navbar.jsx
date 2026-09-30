import { Link } from "react-router-dom";
export default function Navbar() { return <nav><Link className="brand" to="/"><span>ICSF</span><small>Institute of Cybersecurity &amp; Forensics</small></Link><div><Link to="/courses">Programs</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link className="login-link" to="/login">Portal Login</Link></div></nav>; }

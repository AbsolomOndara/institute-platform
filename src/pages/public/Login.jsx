import { useState } from "react"; import { Link, useNavigate } from "react-router-dom"; import { useAuth } from "../../context/AuthContext";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState(""); const { signIn } = useAuth(); const navigate = useNavigate();
  async function submit(e) { e.preventDefault(); try { const user = await signIn(form); navigate(user.mustChangePassword ? "/account" : user.role === "ADMIN" ? "/admin" : user.role === "TUTOR" ? "/tutor" : "/student"); } catch { setError("Invalid email or password."); } }
  return <main className="container narrow"><h1>Login</h1><form onSubmit={submit}><label>Email<input type="email" required onChange={e => setForm({...form,email:e.target.value})} /></label><label>Password<input type="password" required onChange={e => setForm({...form,password:e.target.value})} /></label>{error && <p className="error">{error}</p>}<button>Login</button></form><p><Link className="inline-link" to="/forgot-password">Forgot password?</Link></p></main>;
}

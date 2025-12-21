import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signup, setSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = signup
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (res.error) throw res.error;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth">
            <h1>🍽 Restaurant Reviews</h1>
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={submit}>
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button disabled={loading}>
                    {loading ? "Processing..." : signup ? "Sign Up" : "Login"}
                </button>
            </form>
            <button onClick={() => setSignup(!signup)} style={{ marginTop: '10px', background: 'transparent', color: '#333', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                {signup ? "Already have an account? Login" : "Create new account"}
            </button>
        </div>
    );
}

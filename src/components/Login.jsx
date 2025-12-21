import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";

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
            if (signup) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            const errorCode = err.code;
            let message = err.message;

            const errorMap = {
                'auth/invalid-email': 'Invalid email address.',
                'auth/user-disabled': 'This user account has been disabled.',
                'auth/user-not-found': 'No user found with this email.',
                'auth/wrong-password': 'Incorrect password.',
                'auth/email-already-in-use': 'Email is already registered.',
                'auth/operation-not-allowed': 'Email/Password sign-in is not enabled in Firebase Console.',
                'auth/weak-password': 'Password should be at least 6 characters.'
            };

            if (errorMap[errorCode]) {
                message = errorMap[errorCode];
            } else if (message.includes("Firebase: ")) {
                message = message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "");
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="auth-card"
            >
                <h1 style={{ marginBottom: '10px' }}>🍽 <br />Fine Dining</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    {signup ? "Create your culinary journey" : "Welcome back, food lover"}
                </p>

                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="error"
                        style={{ color: '#ff6b81', background: 'rgba(255, 107, 129, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={submit}>
                    <input
                        className="auth-input"
                        placeholder="Email Address"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                        {loading ? "Processing..." : signup ? "Sign Up" : "Login"}
                    </button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => setSignup(!signup)}
                        style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem', padding: 0 }}
                    >
                        {signup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

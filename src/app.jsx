import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Star, X, Plus, LogOut, User } from "lucide-react";

/* 🔐 ENV VARIABLES (Netlify compatible) */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* ================= LOGIN ================= */

function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = signup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (res.error) setError(res.error.message);
    setLoading(false);
  };

  return (
    <div className="auth">
      <h1>🍽 Restaurant Reviews</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <button>{loading ? "..." : signup ? "Sign Up" : "Login"}</button>
      </form>
      <button onClick={()=>setSignup(!signup)}>
        {signup ? "Already have account?" : "Create new account"}
      </button>
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selected, setSelected] = useState(null);

  /* AUTH */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user || null);
    });
  }, []);

  /* LOAD FOODS */
  const loadFoods = async () => {
    const { data } = await supabase.from("foods").select("*").order("created_at",{ascending:false});
    setFoods(data || []);
  };

  useEffect(() => {
    if (user) loadFoods();
  }, [user]);

  if (!user) return <Login />;

  return (
    <div className="container">
      <header>
        <h2>Menu</h2>
        <div>
          <User size={18}/> {user.email}
          <button onClick={()=>supabase.auth.signOut()}><LogOut/></button>
        </div>
      </header>

      <div className="grid">
        {foods.map(f => (
          <div key={f.id} className="card" onClick={()=>setSelected(f)}>
            <img src={f.image}/>
            <h3>{f.name}</h3>
            <p>${f.price}</p>
            <p>⭐ {f.rating || 0}</p>
          </div>
        ))}
      </div>

      {selected && <FoodModal food={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

/* ================= FOOD MODAL ================= */

function FoodModal({ food, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    const review = {
      id: Date.now(),
      rating,
      comment,
      createdAt: new Date()
    };

    const reviews = [...(food.reviews || []), review];
    const avg = reviews.reduce((a,b)=>a+b.rating,0)/reviews.length;

    await supabase.from("foods")
      .update({ reviews, rating: avg })
      .eq("id", food.id);

    onClose();
  };

  return (
    <div className="modal">
      <button onClick={onClose}><X/></button>
      <h2>{food.name}</h2>
      <img src={food.image}/>
      <textarea placeholder="Write review..." onChange={e=>setComment(e.target.value)}/>
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
}

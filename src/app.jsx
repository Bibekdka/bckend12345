import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { supabase } from "./lib/supabase";
import Login from "./components/Login";
import FoodCard from "./components/FoodCard";
import FoodModal from "./components/FoodModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user || null);
    }) || {};

    return () => subscription?.unsubscribe && subscription.unsubscribe();
  }, []);

  const loadFoods = async () => {
    try {
      const { data, error } = await supabase.from("foods").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setFoods(data || []);
    } catch (err) {
      console.error("Error loading foods:", err.message);
    }
  };

  useEffect(() => {
    if (user) loadFoods();
  }, [user, selected]); // Reload foods when selection closes (in case of updates) or just rely on state?
  // Actually, FoodModal updates the database but not the local `foods` state in App directly. 
  // It's better to reload foods when modal closes. 
  // So I'll add a `refresh` function or just separate effect.
  // The original code reloaded on `user` change.
  // I will make `onClose` trigger a reload or update the state.

  const handleCloseModal = () => {
    setSelected(null);
    loadFoods(); // Refresh data to show new ratings
  };

  if (loading) return <div className="container">Loading...</div>;

  if (!user) return <Login />;

  return (
    <div className="container">
      <header>
        <h2>Menu</h2>
        <div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <User size={18} /> {user.email}
          </span>
          <button onClick={() => supabase.auth.signOut()} style={{ marginLeft: '10px' }}>
            Sign Out <LogOut size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </header>

      <div className="grid">
        {foods.map(f => (
          <FoodCard key={f.id} food={f} onClick={() => setSelected(f)} />
        ))}
      </div>

      {selected && <FoodModal food={selected} onClose={handleCloseModal} />}
    </div>
  );
}


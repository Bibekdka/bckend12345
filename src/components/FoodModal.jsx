import { useState } from "react";
import { X, Star } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function FoodModal({ food, onClose }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submitReview = async () => {
        if (!comment.trim()) return;
        setSubmitting(true);

        try {
            const review = {
                id: Date.now(),
                rating,
                comment,
                createdAt: new Date().toISOString()
            };

            const reviews = [...(food.reviews || []), review];
            const avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

            const { error } = await supabase.from("foods")
                .update({ reviews, rating: avg })
                .eq("id", food.id);

            if (error) throw error;

            onClose();
        } catch (e) {
            alert("Error submitting review: " + e.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="modal" style={{
                position: 'relative', width: '90%', maxWidth: '500px',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 10, right: 10, border: 'none', background: 'transparent', cursor: 'pointer'
                }}>
                    <X />
                </button>

                <h2>{food.name}</h2>
                <img src={food.image} alt={food.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />

                <div style={{ margin: '20px 0' }}>
                    <h3>Add Your Review</h3>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={24}
                                fill={star <= rating ? "gold" : "none"}
                                color={star <= rating ? "gold" : "#ccc"}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <textarea
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        style={{ width: '100%', padding: '10px', minHeight: '80px', marginBottom: '10px' }}
                    />
                    <button onClick={submitReview} disabled={submitting} style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>

                <div className="reviews-list">
                    <h3>Reviews ({food.reviews?.length || 0})</h3>
                    {(!food.reviews || food.reviews.length === 0) && <p style={{ color: '#777' }}>No reviews yet. Be the first!</p>}
                    {(food.reviews || []).slice().reverse().map(r => ( // Show newest first
                        <div key={r.id || Math.random()} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                <Star size={14} fill="gold" color="gold" />
                                <strong>{r.rating}</strong>
                                <span style={{ fontSize: '0.8em', color: '#888' }}>
                                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown date'}
                                </span>
                            </div>
                            <p style={{ margin: 0 }}>{r.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

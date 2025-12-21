import React from "react";
import { Star } from "lucide-react";

export default function FoodCard({ food, onClick }) {
    return (
        <div className="card" onClick={onClick}>
            <img src={food.image} alt={food.name} />
            <h3>{food.name}</h3>
            <p>${food.price}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill={food.rating ? "orange" : "none"} color={food.rating ? "orange" : "#ccc"} />
                <span>{food.rating ? food.rating.toFixed(1) : "New"}</span>
                <span style={{ color: '#666', fontSize: '0.8em' }}>
                    ({food.reviews?.length || 0})
                </span>
            </div>
        </div>
    );
}

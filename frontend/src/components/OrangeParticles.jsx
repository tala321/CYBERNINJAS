import { useEffect, useState } from "react";
import "./OrangeParticles.css";

export default function OrangeParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const particle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4,
        rotate: Math.random() * 360,
      };

      setParticles((prev) => [
        ...prev.slice(-25),
        particle,
      ]);
    };


    window.addEventListener(
      "mousemove",
      handleMouseMove
    );


    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };

  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setParticles((prev) =>
        prev.slice(1)
      );
    }, 500);


    return () => clearInterval(timer);

  }, []);


  return (
    <div className="orange-particles-layer">

      {particles.map((p) => (

        <span
          key={p.id}
          className="orange-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            transform:
              `rotate(${p.rotate}deg)`
          }}
        />

      ))}

    </div>
  );
}
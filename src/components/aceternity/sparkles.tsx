"use client";
import React, { useId, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  children?: React.ReactNode;
}

export const Sparkles: React.FC<SparklesProps> = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 1200,
  particleColor = "#FFF",
  children,
}) => {
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    size: number;
    delay: number;
  }>>([]);

  const particleId = useId();

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < particleDensity / 100; i++) {
        newParticles.push({
          id: `${particleId}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (maxSize - minSize) + minSize,
          delay: Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, [particleDensity, maxSize, minSize, particleId]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background }}
      {...(id && { id })}
    >
      <div className="relative z-10">
        {children}
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
              backgroundColor: particleColor,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 2 + 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};
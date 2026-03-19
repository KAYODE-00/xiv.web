"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

const ensureGsap = () => {
  if (typeof window === "undefined") return;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
};

const getVariant = (name) => {
  switch (name) {
    case "slideInLeft":
      return { from: { opacity: 0, x: -40 }, to: { opacity: 1, x: 0 } };
    case "slideInRight":
      return { from: { opacity: 0, x: 40 }, to: { opacity: 1, x: 0 } };
    case "fadeIn":
      return { from: { opacity: 0, y: 24 }, to: { opacity: 1, y: 0 } };
    default:
      return { from: { opacity: 1, x: 0, y: 0 }, to: { opacity: 1, x: 0, y: 0 } };
  }
};

export const getMotionProps = (content, enabled) => {
  const animation = content?.scrollAnimation || "none";
  const duration = Number(content?.animationDuration || 0.5);
  const delay = Number(content?.animationDelay || 0);

  if (!enabled || animation === "none") {
    return {
      initial: false,
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0 },
    };
  }

  const variant = getVariant(animation);
  return {
    initial: variant.from,
    animate: variant.to,
    transition: {
      duration: Number.isFinite(duration) ? duration : 0.5,
      delay: Number.isFinite(delay) ? delay : 0,
      ease: "easeOut",
    },
  };
};

export const setupScrollAnimation = (element, content, enabled) => {
  ensureGsap();
  if (!enabled || !element) return () => {};

  const animation = content?.scrollAnimation || "none";
  if (animation === "none") return () => {};

  const duration = Number(content?.animationDuration || 0.8);
  const delay = Number(content?.animationDelay || 0);
  const variant = getVariant(animation);

  const tween = gsap.fromTo(
    element,
    variant.from,
    {
      ...variant.to,
      duration: Number.isFinite(duration) ? duration : 0.8,
      delay: Number.isFinite(delay) ? delay : 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );

  return () => {
    if (tween?.scrollTrigger) tween.scrollTrigger.kill();
    tween.kill();
  };
};

// Fix: Added React import to resolve the 'Cannot find namespace React' error when using React.ReactNode.
import React from 'react';

export interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type View = 'home' | 'quote' | 'your-move' | 'admin';
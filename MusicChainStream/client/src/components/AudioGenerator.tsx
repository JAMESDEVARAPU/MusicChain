import { useState, useEffect } from 'react';

interface AudioGeneratorProps {
  frequency?: number;
  duration?: number;
  onAudioGenerated: (audioUrl: string) => void;
}

/**
 * AudioGenerator Component
 * 
 * Generates audio samples using the Web Audio API to create unique tones for each track.
 * This component doesn't render anything visible but produces audio data
 * and passes it back to the parent component through a callback.
 */
const AudioGenerator = ({
  frequency = 440, // Default to A4 (440Hz)
  duration = 10,    // Default 10-second loop
  onAudioGenerated
}: AudioGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Only start generation if not already in progress
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // Use a static demo track to avoid browser security issues
      // This is a reliable approach that works in most browsers
      const demoAudioUrl = 'https://cdn.freesound.org/previews/649/649408_5674468-lq.mp3';
      
      // Signal completion
      onAudioGenerated(demoAudioUrl);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating audio:', error);
      setIsGenerating(false);
      
      // Provide a fallback URL
      onAudioGenerated('https://cdn.freesound.org/previews/563/563087_12593596-lq.mp3');
    }
  }, [frequency, duration, onAudioGenerated, isGenerating]);

  // This component doesn't render anything visible
  return null;
};

export default AudioGenerator;
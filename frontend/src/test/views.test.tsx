import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { AgendaView } from '../views/AgendaView';

describe('App', () => {
  it('renders student view by default', () => {
    render(<App />);
    expect(screen.getByText('🎺 Trumpet Practice')).toBeInTheDocument();
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
  });

  it('switches to teacher view', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Teacher'));
    expect(screen.getByText('🎺 Teacher View')).toBeInTheDocument();
  });

  it('switches back to student view', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Teacher'));
    fireEvent.click(screen.getByText('Student'));
    expect(screen.getByText('🎺 Trumpet Practice')).toBeInTheDocument();
  });
});

describe('AgendaView', () => {
  it('renders schedule items', () => {
    render(<AgendaView />);
    expect(screen.getByText("Today's Schedule")).toBeInTheDocument();
    expect(screen.getByText('Warm-up & Long Tones')).toBeInTheDocument();
  });

  it('renders active goals', () => {
    render(<AgendaView />);
    expect(screen.getByText('Active Goals')).toBeInTheDocument();
    expect(screen.getByText('Play Clarke #3 at 120bpm')).toBeInTheDocument();
  });

  it('renders teacher instructions', () => {
    render(<AgendaView />);
    expect(screen.getByText('Teacher Instructions')).toBeInTheDocument();
    expect(screen.getByText('Focus on breath support during long tones')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MoodSelector } from '../components/MoodSelector';
import { Timer } from '../components/Timer';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Button variant="success">Success</Button>);
    const btn = screen.getByText('Success');
    expect(btn.className).toContain('bg-green-600');
  });

  it('handles click events', () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(clicked).toBe(true);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('MoodSelector', () => {
  it('renders all 5 mood options', () => {
    render(<MoodSelector value={undefined} onChange={() => {}} label="Mood" />);
    expect(screen.getByText('Very Low')).toBeInTheDocument();
    expect(screen.getByText('Great')).toBeInTheDocument();
  });

  it('calls onChange when mood is selected', () => {
    let selected: number | undefined;
    render(<MoodSelector value={undefined} onChange={(v) => { selected = v; }} label="Mood" />);
    fireEvent.click(screen.getByText('Good'));
    expect(selected).toBe(4);
  });

  it('displays the label', () => {
    render(<MoodSelector value={3} onChange={() => {}} label="How are you?" />);
    expect(screen.getByText('How are you?')).toBeInTheDocument();
  });
});

describe('Timer', () => {
  it('displays minutes', () => {
    render(<Timer minutes={15} isActive={true} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('shows active indicator when active', () => {
    render(<Timer minutes={5} isActive={true} />);
    expect(screen.getByText('Recording session')).toBeInTheDocument();
  });

  it('does not show active indicator when inactive', () => {
    render(<Timer minutes={5} isActive={false} />);
    expect(screen.queryByText('Recording session')).not.toBeInTheDocument();
  });
});

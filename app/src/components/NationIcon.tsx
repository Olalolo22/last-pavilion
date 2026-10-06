// Centralised icon resolver for nations.
// Add new icon names here as nations are added.
import React from 'react';
import {
  Zap,
  Lock,
  Landmark,
  Waves,
  Globe,
  Flame,
  Scale,
  Hexagon,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Zap,
  Lock,
  Landmark,
  Waves,
  Globe,
  Flame,
  Scale,
  Hexagon,
};

interface NationIconProps extends LucideProps {
  name: string;
}

export function NationIcon({ name, ...props }: NationIconProps) {
  const Icon = ICON_MAP[name] ?? HelpCircle;
  return <Icon {...props} />;
}

import React from 'react';
import { RiskLevel, AnalysisStatus } from '../../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, HelpCircle, ShieldAlert } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'indigo' | 'orange';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-orange-50 text-orange-800 border-orange-200',
    orange: 'bg-orange-50 text-orange-800 border-orange-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide uppercase font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  switch (level) {
    case 'low':
      return (
        <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
          Low Risk
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="warning" icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}>
          Needs Review
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="danger" icon={<AlertOctagon className="w-3.5 h-3.5 text-rose-600" />}>
          High Concern
        </Badge>
      );
    case 'critical':
      return (
        <Badge variant="danger" icon={<ShieldAlert className="w-3.5 h-3.5 text-rose-700 animate-pulse" />}>
          Critical Flag
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" icon={<HelpCircle className="w-3.5 h-3.5" />}>
          Unknown
        </Badge>
      );
  }
};

export const StatusBadge: React.FC<{ status: AnalysisStatus }> = ({ status }) => {
  switch (status) {
    case 'no_issue_detected':
      return (
        <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
          No Inconsistencies Found
        </Badge>
      );
    case 'needs_review':
      return (
        <Badge variant="warning" icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}>
          Review Required
        </Badge>
      );
    case 'high_concern':
      return (
        <Badge variant="danger" icon={<AlertOctagon className="w-3.5 h-3.5 text-rose-600" />}>
          High Concern
        </Badge>
      );
    case 'unable_to_analyze':
      return (
        <Badge variant="neutral" icon={<HelpCircle className="w-3.5 h-3.5 text-slate-500" />}>
          Analysis Incomplete
        </Badge>
      );
    case 'analyzing':
      return (
        <Badge variant="orange">
          Analyzing...
        </Badge>
      );
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

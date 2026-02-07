import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  colorScheme?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'indigo'
  className?: string
}

const colorSchemes = {
  blue: {
    card: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800',
    title: 'text-blue-900 dark:text-blue-100',
    value: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
    subtitle: 'text-blue-600/70 dark:text-blue-400/70',
  },
  green: {
    card: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800',
    title: 'text-green-900 dark:text-green-100',
    value: 'text-green-600 dark:text-green-400',
    icon: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
    subtitle: 'text-green-600/70 dark:text-green-400/70',
  },
  orange: {
    card: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800',
    title: 'text-orange-900 dark:text-orange-100',
    value: 'text-orange-600 dark:text-orange-400',
    icon: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900',
    subtitle: 'text-orange-600/70 dark:text-orange-400/70',
  },
  purple: {
    card: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800',
    title: 'text-purple-900 dark:text-purple-100',
    value: 'text-purple-600 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
    subtitle: 'text-purple-600/70 dark:text-purple-400/70',
  },
  red: {
    card: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800',
    title: 'text-red-900 dark:text-red-100',
    value: 'text-red-600 dark:text-red-400',
    icon: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
    subtitle: 'text-red-600/70 dark:text-red-400/70',
  },
  teal: {
    card: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800',
    title: 'text-teal-900 dark:text-teal-100',
    value: 'text-teal-600 dark:text-teal-400',
    icon: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900',
    subtitle: 'text-teal-600/70 dark:text-teal-400/70',
  },
  indigo: {
    card: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800',
    title: 'text-indigo-900 dark:text-indigo-100',
    value: 'text-indigo-600 dark:text-indigo-400',
    icon: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900',
    subtitle: 'text-indigo-600/70 dark:text-indigo-400/70',
  },
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  className,
}: StatCardProps) {
  const colors = colorSchemes[colorScheme]

  return (
    <Card className={cn(colors.card, 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn('text-sm font-medium', colors.title)}>
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-full', colors.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', colors.value)}>{value}</div>
        {subtitle && (
          <p className={cn('text-xs mt-1', colors.subtitle)}>
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

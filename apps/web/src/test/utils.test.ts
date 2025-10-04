import { describe, it, expect } from 'vitest'

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return '#f59e0b'
    case 'in-progress':
      return '#3b82f6'
    case 'completed':
      return '#10b981'
    default:
      return '#6b7280'
  }
}

export const getPriorityLevel = (priority: string): number => {
  switch (priority) {
    case 'low':
      return 1
    case 'medium':
      return 2
    case 'high':
      return 3
    default:
      return 0
  }
}

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2024-01-01')
      expect(result).toBe('Jan 1, 2024')
    })

    it('should handle different date formats', () => {
      const result = formatDate('2024-12-25T10:30:00Z')
      expect(result).toBe('Dec 25, 2024')
    })
  })

  describe('getStatusColor', () => {
    it('should return correct colors for different statuses', () => {
      expect(getStatusColor('pending')).toBe('#f59e0b')
      expect(getStatusColor('in-progress')).toBe('#3b82f6')
      expect(getStatusColor('completed')).toBe('#10b981')
      expect(getStatusColor('unknown')).toBe('#6b7280')
    })
  })

  describe('getPriorityLevel', () => {
    it('should return correct priority levels', () => {
      expect(getPriorityLevel('low')).toBe(1)
      expect(getPriorityLevel('medium')).toBe(2)
      expect(getPriorityLevel('high')).toBe(3)
      expect(getPriorityLevel('unknown')).toBe(0)
    })

    it('should be useful for sorting tasks by priority', () => {
      const tasks = [
        { priority: 'low' },
        { priority: 'high' },
        { priority: 'medium' }
      ]

      const sorted = tasks.sort((a, b) => 
        getPriorityLevel(b.priority) - getPriorityLevel(a.priority)
      )

      expect(sorted[0].priority).toBe('high')
      expect(sorted[1].priority).toBe('medium')
      expect(sorted[2].priority).toBe('low')
    })
  })
})
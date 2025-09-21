import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import Badge from '@/ui/components/Badge/Badge'

describe('Badge Component', () => {
  it('renders the badge with correct text', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies the correct tone classes', () => {
    render(<Badge tone="brand">Brand Badge</Badge>)
    const badge = screen.getByText('Brand Badge')
    expect(badge).toHaveClass('bg-brand-100')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)
    const badge = screen.getByText('Custom Badge')
    expect(badge).toHaveClass('custom-class')
  })
})
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'

export default function CustomCTA() {
  const { theme } = useSegment()
  
  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
    accent: theme?.colors?.accent || '#C6A15B',
  }

  return (
    <section
      id="customize"
      className="py-14"
      style={{ 
        background: `linear-gradient(to bottom, ${themeColors.primary}, ${themeColors.accent})`,
        color: 'white',
      }}
    >
      <Container>
        <div className="text-center">
          <h2 
            className="text-3xl mb-2 font-bold"
            style={{ color: 'white' }}
          >
            Create Your Custom Leather Piece
          </h2>
          <p 
            className="max-w-2xl mx-auto opacity-90"
            style={{ color: 'white' }}
          >
            Our craftsmen can create bespoke leather goods tailored to your exact specifications. 
            From wallets to custom-designed bags, bring your vision to life.
          </p>
          <div className="mt-6">
            <a
              href="#customize-form"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: themeColors.surface,
                color: themeColors.primary,
              }}
            >
              Start Your Custom Design
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
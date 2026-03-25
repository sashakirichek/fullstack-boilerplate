import {describe, it, expect} from 'vitest'
import {seo} from '../utils/seo'

describe('seo utility', () => {
  it('should return a title tag', () => {
    const tags = seo({title: 'Test Page'})
    expect(tags).toContainEqual({title: 'Test Page'})
  })

  it('should include description meta tag when provided', () => {
    const tags = seo({title: 'Test', description: 'A description'})
    expect(tags).toContainEqual({name: 'description', content: 'A description'})
  })
})

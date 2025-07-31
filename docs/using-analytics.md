# Using Analytics in Components

This is a quick reference guide for how to use the analytics hooks in your components.

## Basic Page View Tracking

Page views are automatically tracked with the `GoogleAnalytics` component in the root layout.

## Custom Event Tracking

For custom events, import the tracking functions from the hooks file:

```tsx
'use client';

import { trackButtonClick, trackExternalLink, trackEvent } from '@/hooks/useAnalytics';
import Link from 'next/link';

export default function ExampleComponent() {
  // Track a custom button click
  const handleButtonClick = () => {
    trackButtonClick('download-resume', '/resume');
    // Your button logic here
  };

  // Track a form submission
  const handleFormSubmit = (formData: any) => {
    trackEvent('form_submit', {
      category: 'engagement',
      label: 'contact_form',
      formData: { ...formData, email: 'REDACTED' }, // Don't track personal data
    });
    // Your form submission logic here
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Download Resume</button>
      
      <a 
        href="https://example.com" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={() => trackExternalLink('https://example.com', 'Example Link')}
      >
        External Link
      </a>
    </div>
  );
}
```

## Best Practices

1. Only track anonymous data - avoid collecting personally identifiable information
2. Use consistent naming conventions for events
3. Group related events with the same category
4. Use the label to provide additional context
5. Only track events that provide meaningful insights

## Common Events to Track

- Button clicks
- Form submissions
- File downloads
- External link clicks
- Video plays/completions
- Scroll depth
- Time on page
- Error occurrences

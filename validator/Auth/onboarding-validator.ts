import { z } from 'zod';

// NOTE: reconstructed from your form fields. Merge with your existing file
// and keep any custom error messages / translations you already have.
export const OnboardingFormSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  primary_product_or_service: z.string().min(1, 'Product or service is required'),
  language: z.string().min(1, 'Language is required'),
  website_url: z
    .string()
    .min(1, 'Website is required')
    .regex(
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i,
      'Enter a valid website, e.g. www.example.com'
    ),
  target_country: z.string().min(1, 'Country is required'),
  instagram_username: z.string().optional(),
  linkedin_url: z.string().optional(),
});

export type OnboardingFormValidator = z.infer<typeof OnboardingFormSchema>;
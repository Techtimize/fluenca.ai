import { z } from 'zod';


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

export const IndividualOnboardingFormSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  role: z.string().min(1, 'Tell us what you do'),
  primary_goal: z.string().min(1, 'Primary goal is required'),
  language: z.string().min(1, 'Language is required'),
  platform: z.enum(['instagram', 'linkedin', 'both'], {
    message: 'Select a platform',
  }),
  target_country: z.string().min(1, 'Country is required'),
  instagram_username: z.string().optional(),
  linkedin_url: z.string().optional(),
});

export type IndividualOnboardingFormValidator = z.infer<
  typeof IndividualOnboardingFormSchema
>;
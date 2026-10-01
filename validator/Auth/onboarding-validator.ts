import { z } from 'zod';

export const OnboardingFormSchema = z
    .object({
        company_name: z
            .string()
            .min(2, { message: 'Company name must be at least 2 characters long.' }),
        industry: z.string().min(2, { message: 'Please select an industry.' }),
        primary_product_or_service: z.string().min(2, { message: 'Services must be at least 2 characters long.' }),
        language: z.string().min(2, { message: 'Please select a language.' }),
        website_url: z.string().min(1, { message: 'Please enter your website link.' }),
        target_country: z.string().min(2, { message: 'Please select a target country.' }),
        instagram_username: z.string().min(2, { message: 'Please enter your Instagram username.' }),
        linkedin_url: z.url({message: 'Please enter your LinkedIn URL.'}),
    });


export type OnboardingFormValidator = z.infer<typeof OnboardingFormSchema>;

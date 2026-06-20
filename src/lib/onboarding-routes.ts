export const signInUrl = '/sign-in'
export const signUpUrl = '/sign-up'
export const onboardingAccountUrl = '/sign-up'

export const ONBOARDING_STEP_PATHS = [
  '/sign-up',
  '/onboarding/business',
] as const

export const ONBOARDING_TOTAL_STEPS = ONBOARDING_STEP_PATHS.length

export function onboardingStepPath(step: number) {
  return ONBOARDING_STEP_PATHS[step - 1] ?? '/sign-up'
}

export function isOnboardingBackNavigation(searchParams: URLSearchParams) {
  return searchParams.get('from') === 'onboarding'
}

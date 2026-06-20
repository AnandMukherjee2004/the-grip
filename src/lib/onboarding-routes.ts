export const ONBOARDING_BACK_PARAM = 'from=onboarding'

export const onboardingAccountUrl = `/onboarding?${ONBOARDING_BACK_PARAM}&mode=signin`

export function isOnboardingBackNavigation(searchParams: URLSearchParams) {
  return searchParams.get('from') === 'onboarding'
}

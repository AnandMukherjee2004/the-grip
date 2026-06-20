const ORG_KEY = 'grip_org_id'
const WORKSPACE_KEY = 'grip_workspace_id'

export function persistWorkspaceIds(orgId: string, workspaceId: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ORG_KEY, orgId)
  localStorage.setItem(WORKSPACE_KEY, workspaceId)
}

export function readWorkspaceIds(): { orgId: string | null; workspaceId: string | null } {
  if (typeof window === 'undefined') {
    return { orgId: null, workspaceId: null }
  }
  return {
    orgId: localStorage.getItem(ORG_KEY),
    workspaceId: localStorage.getItem(WORKSPACE_KEY),
  }
}

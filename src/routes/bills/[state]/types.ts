export interface BillsData {
    results: Result[]
    pagination: Pagination
  }
  
  export interface Result {
    id: string
    session: string
    jurisdiction: Jurisdiction
    from_organization: FromOrganization
    identifier: string
    title: string
    classification: string[]
    subject: any[]
    extras: Extras
    created_at: string
    updated_at: string
    openstates_url: string
    first_action_date: string
    latest_action_date: string
    latest_action_description: string
    latest_passage_date: string
  }
  
  export interface Jurisdiction {
    id: string
    name: string
    classification: string
  }
  
  export interface FromOrganization {
    id: string
    name: string
    classification: string
  }
  
  export interface Extras {}
  
  export interface Pagination {
    per_page: number
    page: number
    max_page: number
    total_items: number
  }
export interface SponsoredBills {
	data: Daum[];
	offset: number;
	limit: number;
	count: string;
}

export interface Daum {
	id: string;
	name: string;
	number: string;
	summary: string;
	createdAt: string;
	updatedAt: string;
	timestamp: string;
	status: string;
	sessionId: number;
	chamberId: number;
	sourceUrl: string;
	alphanumSort: string;
	sourceBillId: string;
	source: string;
	legislativeType: string;
	salienceScore: any;
	session: Session;
	aliases: any[];
	actions: Action[];
	teamsTracking: any[];
	billSubjectMentions: BillSubjectMention[];
	committeeMentions: CommitteeMention[];
	tags: Tag[];
	sponsors: Sponsor[];
	billDifferences: BillDifference[];
	sessions: Session2[];
	hearings: any[];
	userAliases: any[];
	teams: any[];
}

export interface Session {
	id: number;
	stateId: number;
	termId: any;
	type: any;
	name: string;
	startedAt: string;
	endedAt: string;
	displayName: string;
	createdAt: string;
	updatedAt: string;
	defaultSession: boolean;
	isCurrent: boolean;
	state: State;
}

export interface State {
	id: number;
	name: string;
	abbreviation: string;
	createdAt: string;
	updatedAt: string;
}

export interface Action {
	id: number;
	billId: string;
	actionDate: string;
	description: string;
	hashCode: string;
	createdAt: string;
	updatedAt: string;
	originId: any;
	classifications: string[];
	order: number;
}

export interface BillSubjectMention {
	billId: string;
	billSubjectId: number;
	createdAt: string;
	updatedAt: string;
	billSubject: BillSubject;
}

export interface BillSubject {
	id: number;
	sourceSubject: string;
	jurisdictionId: number;
	createdAt: string;
	updatedAt: string;
	displayName: string;
}

export interface CommitteeMention {
	id: number;
	name: string;
	chamber: string;
	createdAt: string;
	updatedAt: string;
	jurisdictionId: number;
	isActive: boolean;
	parentCommitteeId: any;
	sourceCommitteeId?: string;
	source?: string;
	sourceParentCommitteeId: any;
	committeeId: any;
	policyAreas: PolicyArea[];
	_pivot_bill_id: string;
	_pivot_committee_mention_id: number;
}

export interface PolicyArea {
	id: number;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	_pivot_committee_id: number;
	_pivot_policy_area_id: number;
}

export interface Tag {
	id: number;
	name: string;
	description: string;
	organizationUserId: number;
	createdAt: string;
	updatedAt: string;
	color: any;
	teamId: number;
	isPublic: boolean;
	_pivot_bill_id: string;
	_pivot_tag_id: number;
}

export interface Sponsor {
	id: number;
	billId: string;
	firstName: string;
	lastName: string;
	createdAt: string;
	updatedAt: string;
	sourceSponsorId: string;
	isPrimary: boolean;
	name: string;
	personId?: number;
	isRemoved: boolean;
}

export interface BillDifference {
	id: number;
	billId: string;
	oldName: string;
	newName: string;
	oldStatus?: string;
	newStatus?: string;
	actions: string;
	sponsors: string;
	versions: string;
	createdAt: string;
	updatedAt: string;
	committeeMentions: string;
	relations: any;
}

export interface Session2 {
	id: number;
	stateId: number;
	termId: any;
	type: any;
	name: string;
	startedAt: string;
	endedAt: string;
	displayName: string;
	createdAt: string;
	updatedAt: string;
	defaultSession: boolean;
	isCurrent: boolean;
	state: State2;
}

export interface State2 {
	id: number;
	name: string;
	abbreviation: string;
	createdAt: string;
	updatedAt: string;
}

export interface Root {
	id: number;
	source: string;
	sourceIds: string[];
	name: string;
	givenName: string;
	middleName: string;
	familyName: string;
	gender: string;
	suffix: string;
	imageUrl: string;
	createdAt: string;
	updatedAt: string;
	dateOfBirth: any;
	dateOfDeath: any;
	extras: Extras;
	electedPositions: ElectedPosition[];
	legislativeAddresses: LegislativeAddress[];
}

export interface Extras {
	race: string;
	aliases: Alias[];
	is_dead: any;
	hometown: any;
	religion: any;
	native_of: any;
	occupation: any;
	description: any;
	public_notes: any;
	lis_member_id: any;
	pronunciation: any;
	place_of_birth: any;
	person_contacts: PersonContact[];
}

export interface Alias {
	prefix: string;
	suffix: string;
	last_name: string;
	first_name: string;
	middle_name: any;
	is_preferred?: boolean;
}

export interface PersonContact {
	contact_note: any;
	contact_string: string;
	contact_type_name: string;
}

export interface ElectedPosition {
	id: number;
	personId: number;
	source: string;
	sourceIds: string[];
	isActive: boolean;
	role: string;
	jurisdictionId: number;
	party: string;
	chamberId: number;
	district: string;
	email: string;
	facebook: string;
	twitter: string;
	youtube: string;
	sources: Source[];
	contacts: Contact[];
	createdAt: string;
	updatedAt: string;
	legislativeDistrictId: any;
	startDate: string;
	endDate: any;
	electedPositionStatus: any;
	extras: Extras2;
	chamber: Chamber;
	jurisdiction: Jurisdiction;
	committeeMemberships: CommitteeMembership[];
}

export interface Source {
	url: string;
}

export interface Contact {
	voice: string;
	address: string;
	classification: string;
}

export interface Extras2 {
	suffix: string;
	last_name: string;
	first_name: string;
}

export interface Chamber {
	id: number;
	stateId: number;
	type: string;
	name: string;
	title: string;
	state: State;
}

export interface State {
	id: number;
	name: string;
	abbreviation: string;
	createdAt: string;
	updatedAt: string;
}

export interface Jurisdiction {
	id: number;
	name: string;
	abbreviation: string;
	createdAt: string;
	updatedAt: string;
}

export interface CommitteeMembership {
	id: number;
	role: string;
	committeeId: number;
	electedPositionId: number;
	createdAt: string;
	updatedAt: string;
	rank: string;
	status: any;
	sourceId: string;
	committee: Committee;
}

export interface Committee {
	id: number;
	name: string;
	sourceId: string;
	parentId: any;
	chamber: string;
	jurisdictionId: number;
	links: string[];
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	legislativeOrganizationId: number;
	officeType: any;
	startDate: string;
	endDate: any;
	sourceIds: string[];
	extras: Extras3;
	source: string;
}

export interface Extras3 {
	district_no: any;
	public_notes: string;
	senate_class: any;
}

export interface LegislativeAddress {
	streetAddress: string;
	city: string;
	state: string;
	postalCode: string;
	id: number;
	title: string;
	phone: string;
	note: any;
}

export interface BillDetails {
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
	actions: Action[];
	aliases: any[];
	billDifferences: BillDifference[];
	billSubjectMentions: BillSubjectMention[];
	committeeMentions: CommitteeMention[];
	session: Session;
	sponsors: Sponsor[];
	tags: any[];
	teamsTracking: any[];
	versions: Version[];
	identical: any[];
	related: any[];
	hearings: Hearing[];
	votes: Vote[];
	insightTopics: any[];
	sessions: Session2[];
	userAliases: any[];
	teams: any[];
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
	person?: Person;
}

export interface Person {
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
	extras?: Extras;
	electedPositions: ElectedPosition[];
}

export interface Extras {
	race: string;
	aliases: Alias[];
	is_dead?: string;
	hometown?: string;
	religion: any;
	native_of?: string;
	occupation?: string;
	description: any;
	public_notes: any;
	lis_member_id: any;
	pronunciation: any;
	place_of_birth?: string;
	person_contacts: PersonContact[];
}

export interface Alias {
	prefix?: string;
	suffix?: string;
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
	facebook?: string;
	twitter?: string;
	youtube: string;
	sources: Source[];
	contacts: Contact[];
	createdAt: string;
	updatedAt: string;
	legislativeDistrictId: any;
	startDate?: string;
	endDate: any;
	electedPositionStatus: any;
	extras?: Extras2;
}

export interface Source {
	url: string;
}

export interface Contact {
	voice?: string;
	address: string;
	classification: string;
}

export interface Extras2 {
	suffix: string;
	last_name: string;
	first_name: string;
}

export interface Version {
	id: number;
	billId: string;
	text: string;
	createdAt: string;
	updatedAt: string;
	docId: string;
	baseText: string;
	versionName: string;
	versionPostedDate: any;
	sourceDocUrl: string;
	sourceDocMediaType: string;
	diffText: string;
	notImportable: boolean;
	notImportableReason: any;
	doNotImport: boolean;
	doNotImportReasonCode: any;
	pdfEmbedOnly: boolean;
}

export interface Hearing {
	id: number;
	jurisdictionId: number;
	start: string;
	eventData: EventData;
	source: string;
	createdAt: string;
	updatedAt: string;
	_pivot_related_source_id: string;
	_pivot_legislative_event_id: number;
}

export interface EventData {
	id: string;
	name: string;
	links: any[];
	agenda: Agenda[];
	status: string;
	all_day: boolean;
	deleted: boolean;
	sources: Source2[];
	end_date: string;
	location: Location;
	start_date: string;
	description: string;
	upstream_id: string;
	jurisdiction: Jurisdiction;
	participants: Participant[];
	classification: string;
}

export interface Agenda {
	media: any[];
	notes: any[];
	order: number;
	extras: Extras3;
	subjects: any[];
	description: string;
	classification: any[];
	related_entities: RelatedEntity[];
}

export interface Extras3 {}

export interface RelatedEntity {
	bill: Bill;
	name: string;
	note: string;
	entity_type: string;
}

export interface Bill {
	id: string;
	title: string;
	session: string;
	identifier: string;
}

export interface Source2 {
	url: string;
	note: string;
}

export interface Location {
	url: string;
	name: string;
}

export interface Jurisdiction {
	id: string;
	name: string;
	classification: string;
}

export interface Participant {
	name: string;
	note: string;
	entity_type: string;
}

export interface Vote {
	id: number;
	url: string;
	startDate: string;
	result: string;
	yesCounts: number;
	noCounts: number;
	otherCounts: number;
	createdAt: string;
	updatedAt: string;
	billId: string;
	motion: string;
	agency: string;
	sourceVoteId: string;
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

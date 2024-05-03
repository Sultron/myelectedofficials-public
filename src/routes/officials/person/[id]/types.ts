// Official Info
export interface OfficialInfo {
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

export interface AddressDetails {
	resultStatus: string;
	zip5: string;
	defaultCity: string;
	defaultState: string;
	defaultRecordType: string;
	citiesList: any[];
	nonAcceptList: NonAcceptList[];
}

export interface NonAcceptList {
	city: string;
	state: string;
}

// Define types for request parameters
export interface RequestParams {
	address: string;
	includeOffices: boolean;
	levels: string[];
	roles: string[];
	accessToken: string;
}

// Define types for source
export interface Source {
	name: string;
	official: boolean;
}
// Define types for office
export interface Office {
	name: string;
	divisionId: string;
	levels: string[];
	roles: string[];
	sources: Source[];
	officialIndices: number[];
}

// Define types for address
export interface Address {
	locationName: string;
	line1: string;
	line2: string;
	line3: string;
	city: string;
	state: string;
	zip: string;
}

// Define types for channel
export interface Channel {
	type: string;
	id: string;
}

// Define types for normalizedInput
export interface NormalizedInput {
	locationName: string;
	line1: string;
	line2: string;
	line3: string;
	city: string;
	state: string;
	zip: string;
}

// Define types for official
export interface Official {
	name: string;
	address: Address[];
	party: string;
	phones: string[];
	urls: string[];
	photoUrl: string;
	emails: string[];
	channels: Channel[];
}

// Define types for response data
export interface ResponseData {
	kind: string;
	normalizedInput: NormalizedInput;
	divisions: Record<
		string,
		{
			name: string;
			alsoKnownAs: string[];
			officeIndices: number[];
		}
	>;
	offices: Office[];
	officials: Official[];
}

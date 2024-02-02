export interface IOrganizationPos {
    uid: string;
    name: string;
}

export interface IOrganization {
    uid: string;
    shortName: string;
    poses: IOrganizationPos[];
}

export interface IFranchisee {
    uid: string;
    name: string;
    organizations: IOrganization[];
}

export interface ICompany {
    uid: string;
    shortName: string;
    fullName: string;
    organizations: IOrganization[];
    franchisees: IFranchisee[];
}

export class CompanyOutput {
    organizationUids: string[] = [];
    organizationPosUids: string[] = [];
    franchiseeUids: string[] = [];
}

export enum ECompanyNode {
    Organization = "organizations",
    OrganisationPose = "poses",
    Franchisee = "franchisees"
}
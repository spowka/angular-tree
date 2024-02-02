import { Pipe, PipeTransform } from '@angular/core';
import { TreeViewInput } from '../../../shared/models/tree-view.model';
import { ECompanyNode, IFranchisee, IOrganization, IOrganizationPos } from '../models/organization.model';

@Pipe({
  name: 'companyToTreeViewInput',
  standalone: true,
})
export class CompanyToTreeViewInputPipe implements PipeTransform {

  transform(data: any | null): TreeViewInput[] {
    const _result: TreeViewInput[] = [];

    if (!data) {
      return [];
    }

    if (data[ECompanyNode.Organization]) {
      data.organizations.forEach((organization: IOrganization) => {
        const organizationNode: TreeViewInput = {
          uid: organization.uid,
          name: organization.shortName,
          parentNode: ECompanyNode.Organization,
        };

        if (organization.poses && organization.poses.length) {
          organizationNode.childrens = this.transform(organization);
        }

        _result.push(organizationNode);
      });
    }

    if (data[ECompanyNode.OrganisationPose]) {
      data.poses.forEach((pose: IOrganizationPos) => {
        const organizationNode: TreeViewInput = {
          uid: pose.uid,
          name: pose.name,
          parentNode: ECompanyNode.OrganisationPose,
        };

        _result.push(organizationNode);
      });
    }

    if (data[ECompanyNode.Franchisee]) {
      data.franchisees.forEach((franchisee: IFranchisee) => {
        const franchiseeNode: TreeViewInput = {
          uid: franchisee.uid,
          name: franchisee.name,
          parentNode: ECompanyNode.Franchisee,
        };

        franchiseeNode.childrens = this.transform(franchisee)

        _result.push(franchiseeNode);
      });
    }

    return _result;
  }

}
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/organizations.service';
import { Observable } from 'rxjs';
import { ICompany, CompanyOutput, ECompanyNode } from './models/organization.model';
import { TreeViewComponent } from '../../shared/tree-view/tree-view.component';
import { CompanyToTreeViewInputPipe } from './pipes/company-tree-input.pipe';
import { TreeViewOutput } from '../../shared/models/tree-view.model';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    TreeViewComponent,
    CompanyToTreeViewInputPipe,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent implements OnInit {
  public company$: Observable<ICompany>;
  public selectedNodes: CompanyOutput;

  public showResult: CompanyOutput;

  constructor(private companyService: CompanyService) { }

  public ngOnInit(): void {
    this.company$ = this.companyService.getOrganizationsData();
  }

  public onSelectNodes() {
    // Имитация обработки кнопки "Выбрать"
    this.showResult = { ...this.selectedNodes };
    console.log("==========================");
    console.dir(this.showResult);
    console.log("==========================");
  }

  public onSelectionChange(nodes: TreeViewOutput[]) {
    this.selectedNodes = this.treeOutputToDto(nodes);
  }

  private treeOutputToDto(nodes: TreeViewOutput[]): CompanyOutput {
    return nodes.reduce((acc, curr) => {
      switch (curr.parentNode) {
        case ECompanyNode.Organization:
          acc.organizationUids.push(curr.uid)
          break;
        case ECompanyNode.OrganisationPose:
          acc.organizationPosUids.push(curr.uid)
          break;
        case ECompanyNode.Franchisee:
          acc.franchiseeUids.push(curr.uid)
          break;
      }

      return acc;
    }, new CompanyOutput())
  }
}

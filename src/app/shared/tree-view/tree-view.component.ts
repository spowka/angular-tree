import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, type OnInit, EventEmitter, inject, DestroyRef } from '@angular/core';
import { TreeViewFlatInput, TreeViewInput, TreeViewOutput } from '../models/tree-view.model';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { of as ofObservable, Observable, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tree-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewComponent implements OnInit {
  @Input({ required: true }) dataSource: TreeViewInput[];
  @Output() change = new EventEmitter<TreeViewOutput[]>();

  public flatNodeMap: Map<TreeViewFlatInput, TreeViewInput> = new Map<TreeViewFlatInput, TreeViewInput>();
  public nestedNodeMap: Map<TreeViewInput, TreeViewFlatInput> = new Map<TreeViewInput, TreeViewFlatInput>();

  public treeControl: FlatTreeControl<TreeViewFlatInput>;
  public treeFlattener: MatTreeFlattener<TreeViewInput, TreeViewFlatInput>;
  public flatDataSource: MatTreeFlatDataSource<TreeViewInput, TreeViewFlatInput>;

  public checklistSelection = new SelectionModel<TreeViewFlatInput>(true /* multiple */);

  private destroyRef = inject(DestroyRef);

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformFunction.bind(this), this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TreeViewFlatInput>(this.getLevel, this.isExpandable);
    this.flatDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.flatDataSource.data = this.dataSource;

    this.checklistSelection.changed.pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef)).subscribe(node => {
      this.change.emit(node.source.selected.map(flatNode => this.flatNodeMap.get(flatNode)) as TreeViewOutput[]);
    })
  }

  public hasChildrens(_: number, node: TreeViewFlatInput) {
    return node.expandable;
  };

  public descendantsPartiallySelected(node: TreeViewFlatInput): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  public nodeSelectionToggle(node: TreeViewFlatInput): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  public descendantsAllSelected(node: TreeViewFlatInput): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const isAllSelected = descendants.every(child => this.checklistSelection.isSelected(child));
    isAllSelected ? this.checklistSelection.select(node) : this.checklistSelection.deselect(node);
    return isAllSelected;
  }

  private getLevel(node: TreeViewFlatInput) {
    return node.level;
  };

  private isExpandable(node: TreeViewFlatInput) {
    return node.expandable;
  };

  private getChildren(node: TreeViewInput): Observable<TreeViewInput[]> {
    return ofObservable(node.childrens!);
  }

  private transformFunction(node: TreeViewInput, level: number) {
    const flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.uid === node.uid
      ? this.nestedNodeMap.get(node)!
      : new TreeViewFlatInput();

    Object.assign(flatNode, { uid: node.uid, name: node.name, level, expandable: !!node.childrens });

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  }
}
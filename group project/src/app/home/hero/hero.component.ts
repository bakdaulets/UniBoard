import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class HeroComponent {
  searchCategory: string = 'People';
  searchName: string = '';
  searchDepartment: string = '';
  searchInterests: string = '';

  constructor(private router: Router) {}

  setCategory(category: string): void {
    this.searchCategory = category;
  }

  search(): void {
    this.router.navigate(['/Directory'], { 
      queryParams: { 
        category: this.searchCategory.toLowerCase(),
        query: this.searchName,
        department: this.searchDepartment,
        interests: this.searchInterests
      } 
    });
  }
}

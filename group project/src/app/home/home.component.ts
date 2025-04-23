import { Component } from '@angular/core';
import { HeadingComponent } from './heading/heading.component';
import { HeroComponent } from './hero/hero.component';
import { ActivityCardsComponent } from './activity-cards/activity-cards.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [HeadingComponent, HeroComponent, ActivityCardsComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

}

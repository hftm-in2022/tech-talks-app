import {
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
  untracked,
} from '@angular/core';
import { TechTalksService } from '../tech-talks.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { distinctUntilChanged, lastValueFrom } from 'rxjs';

export type TechTalk = {
  id: number;
  title: string;
  speaker: string;
  rating: number;
  description: string;
};

@Component({
  selector: 'app-tech-talk-list',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor],
  template: `<div>
    <h1>Tech Talks</h1>

    <label
      >Title
      <input type="text" [(ngModel)]="searchTitle" />
    </label>
    <br />
    <label
      >Speaker
      <input type="text" [(ngModel)]="searchSpeaker" />
    </label>
    <br />
    <label>
      <input type="checkbox" [(ngModel)]="highRatingOnly" /> High Rating
    </label>

    <ul>
      <li *ngFor="let talk of filteredTechTalks()">
        <p>Rating: {{ talk.rating }}</p>
        <a [routerLink]="['/talk', talk.id]">{{ talk.title }}</a>
        <p>{{ talk.speaker }}</p>
      </li>
    </ul>
  </div>`,
  styleUrl: './tech-talk-list.component.css',
})
export class TechTalkListComponent {
  techTalksService = inject(TechTalksService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  readonly techTalks = model<TechTalk[]>([]);
  readonly searchTitle = model<string>('');
  readonly searchSpeaker = model('');
  readonly highRatingOnly = model(false);

  filteredTechTalks = signal<TechTalk[]>([]);

  constructor() {
    this.activatedRoute.queryParamMap.pipe(distinctUntilChanged()).subscribe((params) => {
      this.searchTitle.set(params.get('searchTitle') || '');
      this.searchSpeaker.set(params.get('searchSpeaker') || '');
      this.highRatingOnly.set(params.get('highRatingOnly') === 'true');
   });

    effect(async () => {
      const filter = {
        searchTitle: this.searchTitle(),
        searchSpeaker: this.searchSpeaker(),
        highRatingOnly: this.highRatingOnly(),
      };
      untracked(async () => {
        await this.filterData(filter);
      });
    });
  }

  private async filterData(filter: { searchTitle: string; searchSpeaker: string; highRatingOnly: boolean; }) {
    console.log('Filtering data...', filter);
    const result = await lastValueFrom(
      this.techTalksService.getTechTalks(filter.searchTitle, filter.searchSpeaker, filter.highRatingOnly)
    );
    this.filteredTechTalks.set(result);
    this.router.navigate(['talks'], {
      queryParams: {
        searchTitle: filter.searchTitle,
        searchSpeaker: filter.searchSpeaker,
        highRatingOnly: filter.highRatingOnly,
      },
    });
  }
}

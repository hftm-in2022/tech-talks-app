import {
  Component,
  effect,
  inject,
  model,
} from '@angular/core';
import { TechTalksService } from '../tech-talks.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';
import { TechTalkListStateService } from './state/tech-talk-list-state.service';

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
      @if(loading()) {
      <li>...loading</li>
      } @else {
      <li *ngFor="let talk of filteredTechTalks()">
        <p>Rating: {{ talk.rating }}</p>
        <a [routerLink]="['/talk', talk.id]">{{ talk.title }}</a>
        <p>{{ talk.speaker }}</p>
      </li>
      }
    </ul>
  </div>`,
  styleUrl: './tech-talk-list.component.css',
})
export class TechTalkListComponent {
  techTalksService = inject(TechTalksService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  techTalkListStateService = inject(TechTalkListStateService);

  readonly techTalks = model<TechTalk[]>([]);
  readonly searchTitle = model<string>('');
  readonly searchSpeaker = model('');
  readonly highRatingOnly = model(false);

  filteredTechTalks = this.techTalkListStateService.techTalks;
  loading = this.techTalkListStateService.loading;

  constructor() {
    this.activatedRoute.queryParamMap
      .pipe(distinctUntilChanged())
      .subscribe((params) => {
        this.searchTitle.set(params.get('searchTitle') || '');
        this.searchSpeaker.set(params.get('searchSpeaker') || '');
        this.highRatingOnly.set(params.get('highRatingOnly') === 'true');
        this.techTalkListStateService.rxGetTechTalks({
          searchTitle: this.searchTitle(),
          searchSpeaker: this.searchSpeaker(),
          highRatingOnly: this.highRatingOnly(),
        });
      });

    effect(() => {
      const filter = {
        searchTitle: this.searchTitle(),
        searchSpeaker: this.searchSpeaker(),
        highRatingOnly: this.highRatingOnly(),
      };
      this.router.navigate(['talks'], {
        queryParams: {
          searchTitle: filter.searchTitle,
          searchSpeaker: filter.searchSpeaker,
          highRatingOnly: filter.highRatingOnly,
        },
      });
    });
  }
}

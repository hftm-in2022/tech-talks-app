import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TechTalksService } from '../tech-talks.service';
import { NgClass, NgIf } from '@angular/common';

type TechTalk = {
  id: number;
  title: string;
  speaker: string;
  rating: number;
  description: string;
};

@Component({
  selector: 'app-tech-talk-detail',
  standalone: true,
  imports: [NgIf, NgClass],
  template: `<div *ngIf="talk">
    <h1>{{ talk.title }}</h1>
    <p>Rating: {{ talk.rating }}</p>
    <p>{{ talk.speaker }}</p>
    <p>{{ talk.description }}</p>
    <button>Watch</button>

    <span (click)="rate(1)" [ngClass]="{checked: talk.rating >= 1}" class="fa fa-star checked"></span>
    <span (click)="rate(2)" [ngClass]="{checked: talk.rating >= 2}" class="fa fa-star checked"></span>
    <span (click)="rate(3)" [ngClass]="{checked: talk.rating >= 3}" class="fa fa-star checked"></span>
    <span (click)="rate(4)" [ngClass]="{checked: talk.rating >= 4}" class="fa fa-star"></span>
    <span (click)="rate(5)" [ngClass]="{checked: talk.rating >= 5}" class="fa fa-star"></span>
  </div>`,
  styleUrl: './tech-talk-detail.component.css',
})
export class TechTalkDetailComponent {

  talk: TechTalk | undefined;

  constructor(
    private route: ActivatedRoute,
    private techTalksService: TechTalksService
  ) {}

  ngOnInit(): void {
    const talkId = Number(this.route.snapshot.paramMap.get('id'));
    this.talk = this.techTalksService.getTechTalkById(talkId);
  }

  rate(rating: number) {
    alert(rating);
  }
}

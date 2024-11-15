// src/app/tech-talks.service.ts
import { Injectable } from '@angular/core';
import { TECH_TALKS } from './tech-talks.data';
import { delay, Observable, of } from 'rxjs';

export type TechTalk = {
  id: number;
  title: string;
  speaker: string;
  rating: number;
  description: string;
};

@Injectable({
  providedIn: 'root',
})
export class TechTalksService {
  getTechTalks(
    searchTitle: string,
    searchSpeaker: string,
    highRatingOnly: boolean
  ): Observable<TechTalk[]> {
    return new Observable((observer) => {
      console.log('Getting tech talks...', {searchSpeaker, searchTitle, highRatingOnly});
      const t = setTimeout(() => {
        observer.next(TECH_TALKS.filter((talk) => {
          const matchesTitle = talk.title
            .toLowerCase()
            .includes(searchTitle.toLowerCase());
          const matchesSpeaker = talk.speaker
            .toLowerCase()
            .includes(searchSpeaker.toLowerCase());
          const matchesHighRating = !highRatingOnly || talk.rating >= 4;
          return matchesTitle && matchesSpeaker && matchesHighRating;
        }));
        observer.complete();
      }, Math.floor(Math.random() * 1000));
      () => clearTimeout(t);
    });
  }

  getTechTalkById(id: number) {
    return TECH_TALKS.find((talk) => talk.id === id);
  }
}

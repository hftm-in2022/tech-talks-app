import { computed, inject, Injectable, signal } from '@angular/core';
import { TechTalk, TechTalksService } from '../../tech-talks.service';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';

type GetTechTalks = {
  searchTitle: string;
  searchSpeaker: string;
  highRatingOnly: boolean;
};

type TechTalkListState = {
  isLoading: boolean;
  techTalks: TechTalk[];
  error: Error | null;
};

@Injectable({
  providedIn: 'root',
})
export class TechTalkListStateService {
  #service = inject(TechTalksService);

  // action queue
  #getTechTalkAction$ = new Subject<GetTechTalks>();

  // state
  #state = signal<TechTalkListState>({
    isLoading: false,
    techTalks: [],
    error: null,
  });

  // selectors
  techTalks = computed(() => this.#state().techTalks);
  loading = computed(() => this.#state().isLoading);

  constructor() {
    // async action
    this.#getTechTalkAction$
      .pipe(
        debounceTime(200),
        tap(() => this.setLoadingState()),
        switchMap((action) =>
          this.#service.getTechTalks(
            action.searchTitle,
            action.searchSpeaker,
            action.highRatingOnly
          )
        )
      )
      .subscribe({
        next: (techTalks) => this.setLoadedTechTalks(techTalks),
        error: (error) => this.setError(error),
      });
  }

  // reducers
  setLoadingState() {
    this.#state.update((state) => ({
      ...state,
      isLoading: true,
    }));
  }

  setLoadedTechTalks(techTalks: TechTalk[]) {
    this.#state.update((state) => ({
      ...state,
      isLoading: false,
      techTalks,
    }));
  }

  setError(error: Error) {
    this.#state.update((state) => ({
      ...state,
      isLoading: false,
      error,
    }));
  }

  // async actions
  rxGetTechTalks(filter: {
    searchTitle: string;
    searchSpeaker: string;
    highRatingOnly: boolean;
  }) {
    this.#getTechTalkAction$.next({
      searchTitle: filter.searchTitle,
      searchSpeaker: filter.searchSpeaker,
      highRatingOnly: filter.highRatingOnly,
    });
  }
}
